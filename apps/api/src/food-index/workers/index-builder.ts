/* eslint-disable perfectionist/sort-imports */
import '@intake24/api/bootstrap';

import type InterpretedPhrase from '../interpreted-phrase';

import { parentPort as parentPortNullable, workerData } from 'node:worker_threads';

import LanguageBackends from '@intake24/api/food-index/language-backends';
import type { PhraseMatchResult, PhraseWithKey, PhraseWithKeyAndSource } from '@intake24/api/food-index/phrase-index';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { rankCategoryResults, rankFoodResults } from '@intake24/api/food-index/ranking/ranking';
import type { SearchQuery } from '@intake24/api/food-index/search-query';
import { ParentCategoryIndex } from '@intake24/api/food-index/workers/parent-category-index';
import { NotFoundError } from '@intake24/api/http/errors';
import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';
import { logger as servicesLogger } from '@intake24/common-backend';
import { Database, FoodsLocale, RecipeFood, SynonymSet } from '@intake24/db';
import { localeOptimizer } from '@intake24/api/food-index/locale-config/locale-optimizer';

import {
  fetchLocalCategories,
  fetchLocalFoods,
  fetchRecipeFoodsList,
} from './food-data';
import type { LocalCategoryData } from './food-data';

if (parentPortNullable === null)
  throw new Error('This file can only be run as a worker thread');

const parentPort = parentPortNullable;

const MAX_PHRASE_COMBINATIONS = 1000;

const databases = new Database({
  environment: workerData.env,
  databaseConfig: workerData.dbConnectionInfo,
  logger: servicesLogger,
});
databases.init();

interface LocalFoodIndex {
  foodIndex: PhraseIndex<string>;
  categoryIndex: PhraseIndex<string>;
  parentCategoryIndex: ParentCategoryIndex;
  foodNames: Map<string, string>;
}

interface FoodIndex {
  [key: string]: LocalFoodIndex;
}

type IndexCommand = {
  locales?: string[];
  buildId: any;
  type: 'command';
  exit?: boolean;
  rebuild?: boolean;
};

const foodIndex: FoodIndex = {};

const logger = servicesLogger.child({ service: 'Food index' });

function parseSynonymSet(value: string): Set<string> {
  return new Set<string>(value.trim().split(/\s+/));
}

async function getSynonymSets(localeId: string): Promise<Set<string>[]> {
  const synSets = await SynonymSet.findAll({ attributes: ['synonyms'], where: { localeId } });
  return synSets.map(s => parseSynonymSet(s.synonyms));
}

async function getRecipeFoodsSynomSets(localeId: string): Promise<Set<string>[]> {
  const recipeFoods = await RecipeFood.findAll({
    attributes: ['recipeWord'],
    where: { localeId },
    include: [{ association: 'synonymSet', attributes: ['synonyms'] }],
  });
  return recipeFoods.map(recipeFoodEntry =>
    parseSynonymSet(
      recipeFoodEntry.recipeWord.concat(' ', recipeFoodEntry.synonymSet?.synonyms ?? ''),
    ),
  );
}

async function getLanguageBackendId(localeId: string): Promise<string> {
  const row = await FoodsLocale.findOne({
    attributes: ['foodIndexLanguageBackendId'],
    where: { id: localeId },
  });

  if (!row)
    throw new NotFoundError(`Locale "${localeId}" not found`);

  return row.foodIndexLanguageBackendId;
}

// Building index for each locale
async function buildIndexForLocale(localeId: string): Promise<LocalFoodIndex> {
  const [
    localFoods,
    allLocalCategories,
    synonymSets,
    recipeFoodsSynomSet,
    languageBackendId,
    recipeFoodslist,
  ] = await Promise.all([
    fetchLocalFoods(localeId),
    fetchLocalCategories(localeId),
    getSynonymSets(localeId),
    getRecipeFoodsSynomSets(localeId),
    getLanguageBackendId(localeId),
    fetchRecipeFoodsList(localeId),
  ]);

  const languageBackend = LanguageBackends[languageBackendId];

  if (!languageBackend) {
    throw new NotFoundError(
      `Language backend "${languageBackendId}" for locale "${localeId}" not found`,
    );
  }

  const parentCategoryIndex = new ParentCategoryIndex(localFoods, allLocalCategories, logger);

  const localCategories = allLocalCategories.filter(category => parentCategoryIndex.nonEmptyCategories.has(category.code));

  const foodDescriptions = new Array<PhraseWithKeyAndSource<string>>();

  for (const food of localFoods) {
    if (!food.name)
      continue;

    // Add primary name with source tracking
    foodDescriptions.push({ phrase: food.name, key: food.code, isPrimaryName: true });

    const altNames = food.altNames[languageBackend.languageCode];

    if (altNames !== undefined) {
      // Add alternative names with source tracking
      for (const name of altNames) {
        foodDescriptions.push({ phrase: name, key: food.code, isPrimaryName: false });
      }
    }
  }

  const categoryDescriptions = new Array<PhraseWithKey<string>>();

  for (const category of localCategories) {
    if (!category.name || category.isHidden)
      continue;

    categoryDescriptions.push({ phrase: category.name, key: category.code });
  }

  const foodIndex = new PhraseIndex<string>(
    foodDescriptions,
    LanguageBackends[languageBackendId],
    synonymSets,
    recipeFoodsSynomSet,
    recipeFoodslist,
  );

  const categoryIndex = new PhraseIndex<string>(
    categoryDescriptions,
    LanguageBackends[languageBackendId],
    synonymSets,
  );

  // Create a mapping from food codes to primary localized names
  const foodNames = new Map<string, string>();
  for (const food of localFoods) {
    if (food.name) {
      foodNames.set(food.code, food.name);
    }
  }

  return {
    foodIndex,
    categoryIndex,
    parentCategoryIndex,
    foodNames,
  };
}

/**
 * Function for checking interpreted query against the Special Foods Set and returning the result
 * @param interpretedQuery {InterpretedPhrase} - interpreted query
 * @param query {SearchQuery} - search query
 * @returns FoodHeader[] - array of FoodHeaders of special foods
 */

async function matchRecipeFoods(
  interpretedQuery: InterpretedPhrase,
  query: SearchQuery,
): Promise<FoodHeader[]> {
  const localeIndex = foodIndex[query.parameters.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.parameters.localeId} does not exist or is not enabled`);
  const recipeFoodsTuples = localeIndex.foodIndex.recipeFoodsList;
  const recipeFoodHeaders: FoodHeader[] = [];

  // TODO: Optimise the performance of this function
  for (const recipeFood of recipeFoodsTuples) {
    interpretedQuery.words.forEach((word) => {
      const asTypedExactMatch = recipeFood[1].synonyms.has(word.asTyped);
      word.interpretations.forEach((interpretation) => {
        if (recipeFood[1].synonyms.has(interpretation.dictionaryWord) || asTypedExactMatch) {
          return recipeFoodHeaders.push({
            code: recipeFood[1].code,
            name: recipeFood[1].description,
          });
        }
      });
    });
  }

  const recipeFoodHeadersFiltered: FoodHeader[] = recipeFoodHeaders.reduce((acc, current) => {
    const temp = acc.find(item => item.code === current.code);
    if (!temp)
      return acc.concat([current]);
    else
      return acc;
  }, [] as FoodHeader[]);
  return recipeFoodHeadersFiltered;
}

function getRelevantCategories(index: LocalFoodIndex, foodResults: PhraseMatchResult<string>[], categoryResults: PhraseMatchResult<string>[], transitiveLimit: number): PhraseMatchResult<string>[] {
  const foodCodes = foodResults.map(matchResult => matchResult.key);
  const relevantCategories: Map<string, LocalCategoryData> = new Map<string, LocalCategoryData>();

  for (const foodCode of foodCodes) {
    const transitiveParentCategories = index.parentCategoryIndex.getFoodTransitiveParentCategories(foodCode, transitiveLimit);
    for (const [categoryCode, data] of transitiveParentCategories) {
      // Skip categories that have been matched by the search algorithm to prevent duplicates (for example, "Tap water"/"Water")
      if (!categoryResults.some(result => result.key === categoryCode)) {
        if (!relevantCategories.has(categoryCode))
          relevantCategories.set(categoryCode, data);
      }
    }
  }

  return [...relevantCategories.entries()].map(([categoryCode, categoryData]) => ({
    key: categoryCode,
    phrase: categoryData.name,
    quality: 0,
  }));
}

async function queryIndex(query: SearchQuery): Promise<FoodSearchResponse> {
  const localeIndex = foodIndex[query.parameters.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.parameters.localeId} does not exist or is not enabled`);

  const spellingCorrectionParameters = {
    spellingCorrectionPreference: query.parameters.spellingCorrectionPreference,
    enableEditDistance: query.parameters.enableEditDistance,
    minWordLength1: query.parameters.minWordLength1,
    minWordLength2: query.parameters.minWordLength2,
    enablePhonetic: query.parameters.enablePhonetic,
    minWordLengthPhonetic: query.parameters.minWordLengthPhonetic,
  };

  const matchQualityParameters = {
    firstWordCost: query.parameters.firstWordCost,
    wordOrderCost: query.parameters.wordOrderCost,
    wordDistanceCost: query.parameters.wordDistanceCost,
    unmatchedWordCost: query.parameters.unmatchedWordCost,
  };

  const foodInterpretation = localeIndex.foodIndex.interpretPhrase(
    query.parameters.description,
    spellingCorrectionParameters,
    'foods',
  );
  const foodInterpretedRecipeFoods = localeIndex.foodIndex.interpretPhrase(
    query.parameters.description,
    spellingCorrectionParameters,
    'recipes',
  );
  let recipeFoodsHeaders: FoodHeader[] = [];
  if (foodInterpretedRecipeFoods.words.length > 0)
    recipeFoodsHeaders = await matchRecipeFoods(foodInterpretedRecipeFoods, query);

  const foodResults = localeIndex.foodIndex.findMatches(foodInterpretation, MAX_PHRASE_COMBINATIONS, matchQualityParameters, (foodCode: string) => {
    const acceptHidden = query.parameters.includeHidden || !localeIndex.parentCategoryIndex.isFoodHidden(foodCode);
    const acceptCategory
      = query.parameters.limitToCategory === undefined
        || localeIndex.parentCategoryIndex.isFoodInCategory(foodCode, query.parameters.limitToCategory);

    return acceptHidden && acceptCategory;
  });

  // Deduplicate food results by food code, keeping the best match for each food
  const deduplicatedFoodResults = Array.from(
    foodResults.reduce((map, result) => {
      const existing = map.get(result.key);
      if (!existing || result.quality < existing.quality) {
        map.set(result.key, result);
      }
      return map;
    }, new Map<string, typeof foodResults[0]>()).values(),
  );

  const shouldLogDeduplication = await localeOptimizer.shouldLogDeduplication(query.parameters.localeId);
  if (shouldLogDeduplication) {
    if (deduplicatedFoodResults.length !== foodResults.length) {
      logger.info(`${query.parameters.localeId} locale: Deduplicated ${foodResults.length} results to ${deduplicatedFoodResults.length} unique foods for query "${query.parameters.description}"`);

      // Log duplicate food codes for debugging
      const duplicates = foodResults.reduce((acc, result) => {
        acc[result.key] = (acc[result.key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const duplicatedCodes = Object.entries(duplicates)
        .filter(([_, count]) => count > 1)
        .map(([code, count]) => `${code} (${count}x)`);

      if (duplicatedCodes.length > 0) {
        logger.info(`${query.parameters.localeId} locale: Duplicate food codes found: ${duplicatedCodes.join(', ')}`);
      }
    }
    else {
      logger.info(`${query.parameters.localeId} locale: No duplicates found for query "${query.parameters.description}" (${foodResults.length} results)`);
    }
  }

  const categoryInterpretation = localeIndex.categoryIndex.interpretPhrase(
    query.parameters.description,
    spellingCorrectionParameters,
    'categories',
  );

  const categoryResults = localeIndex.categoryIndex.findMatches(categoryInterpretation, MAX_PHRASE_COMBINATIONS, matchQualityParameters, (categoryCode: string) => {
    return (query.parameters.limitToCategory === undefined || localeIndex.parentCategoryIndex.isSubCategory(categoryCode, query.parameters.limitToCategory));
  });

  if (query.parameters.enableRelevantCategories)
    categoryResults.push(...getRelevantCategories(localeIndex, deduplicatedFoodResults, categoryResults, query.parameters.relevantCategoryDepth));

  const foods = await rankFoodResults(
    deduplicatedFoodResults,
    query.parameters.localeId,
    query.parameters.rankingAlgorithm,
    query.parameters.matchScoreWeight / 100.0,
    logger,
    recipeFoodsHeaders,
    localeIndex.foodNames,
  );

  const categories = await rankCategoryResults(categoryResults, query.parameters.localeId, logger);

  return {
    foods: foods.slice(0, query.parameters.limit),
    categories: categories.slice(0, query.parameters.limit),
  };
}

const cleanUpIndexBuilder = async () => databases.close();

async function buildIndex() {
  const locales = await FoodsLocale.findAll({
    attributes: ['id'],
    where: { foodIndexEnabled: true },
  });
  const enabledLocales = locales.map(({ id }) => id);

  logger.debug(`Enabled locales: ${JSON.stringify(enabledLocales)}`);

  if (Object.keys(foodIndex).length !== 0 && enabledLocales.length !== 0) {
    logger.debug(`Cleaning previous index: ${Object.keys(foodIndex)}`);
    Object.keys(foodIndex).forEach((key) => {
      delete foodIndex[key];
    });
  }

  // Ideally this needs to be done on parallel threads, not sure if worth it in node.js
  for (const localeId of enabledLocales) {
    logger.debug(`Indexing ${localeId}`);
    foodIndex[localeId] = await buildIndexForLocale(localeId);
  }

  parentPort.postMessage('ready');

  parentPort.on('message', async (msg: SearchQuery | IndexCommand) => {
    if (msg.type === 'command') {
      if (msg.exit) {
        await cleanUpIndexBuilder();
        logger.debug('Closing index builder');
        process.exit(0);
      }

      // rebuild index
      if (msg.rebuild) {
        try {
          if (msg.locales && msg.locales.length > 0) {
            const setLocales = new Set(msg.locales);
            logger.debug(`Rebuilding index for ${msg.locales.length} locales`);
            for (const localeId of setLocales)
              foodIndex[localeId] = await buildIndexForLocale(localeId);
          }
          else {
            logger.debug('Rebuilding All indexes');
            for (const localeId of enabledLocales) {
              logger.debug(`Rebuilding All Indexes including: ${localeId}`);
              foodIndex[localeId] = await buildIndexForLocale(localeId);
            }
          }
          parentPort.postMessage({
            type: 'command',
            buildId: msg.buildId,
            success: true,
            rebuild: false,
          });
        }
        catch (err) {
          parentPort.postMessage({
            type: 'command',
            queryId: msg.buildId,
            success: false,
            error: err,
            rebuild: false,
          });
        }
      }
    }
    else if (msg.type === 'query') {
      try {
        const results = await queryIndex(msg);

        parentPort.postMessage({
          type: 'query',
          queryId: msg.queryId,
          success: true,
          results,
        });
      }
      catch (err) {
        parentPort.postMessage({
          type: 'query',
          queryId: msg.queryId,
          success: false,
          error: err,
        });
      }
    }
    else {
      logger.error(`Unknown message type: ${JSON.stringify(msg)}`);
    }
  });
}

(async () => {
  await buildIndex();
})().catch((err) => {
  logger.error(err);
});
