import '@intake24/api/bootstrap';

import { parentPort as parentPortNullable, workerData } from 'node:worker_threads';

import type { PhraseWithKey, RecipeFoodTuple } from '@intake24/api/food-index/phrase-index';
import type { SearchQuery } from '@intake24/api/food-index/search-query';
import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';
import config from '@intake24/api/config/app';
import LanguageBackends from '@intake24/api/food-index/language-backends';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { rankCategoryResults, rankFoodResults } from '@intake24/api/food-index/ranking/ranking';
import { NotFoundError } from '@intake24/api/http/errors';
import { logger as servicesLogger } from '@intake24/common-backend';
import {
  CategoryLocal,
  databaseLogQuery,
  FoodLocal,
  FoodLocalList,
  FoodsLocale,
  models,
  RecipeFoods,
  SequelizeTS,
  SynonymSet,
} from '@intake24/db';

import type InterpretedPhrase from '../interpreted-phrase';

if (parentPortNullable === null) throw new Error('This file can only be run as a worker thread');

const parentPort = parentPortNullable;

const dbLogger = servicesLogger.child({ service: 'Database (food index)' });

const foodsDb = new SequelizeTS({
  ...workerData.dbConnectionInfo.foods,
  models: Object.values(models.foods),
  logging:
    config.env === 'development'
      ? (sql) => databaseLogQuery(sql, dbLogger, workerData.dbConnectionInfo.foods.debugQueryLimit)
      : false,
});

const systemDb = new SequelizeTS({
  ...workerData.dbConnectionInfo.system,
  models: Object.values(models.system),
  logging:
    config.env === 'development'
      ? (sql) => databaseLogQuery(sql, dbLogger, workerData.dbConnectionInfo.system.debugQueryLimit)
      : false,
});

interface LocalFoodIndex {
  foodIndex: PhraseIndex<string>;
  categoryIndex: PhraseIndex<string>;
}

interface FoodIndex {
  [key: string]: LocalFoodIndex;
}

const foodIndex: FoodIndex = {};

const logger = servicesLogger.child({ service: 'Food index' });

function parseSynonymSet(value: string): Set<string> {
  return new Set<string>(value.trim().split(/\s+/));
}

async function getSynonymSets(localeId: string): Promise<Set<string>[]> {
  const synSets = await SynonymSet.findAll({ attributes: ['synonyms'], where: { localeId } });
  return synSets.map((s) => parseSynonymSet(s.synonyms));
}

async function getRecipeFoodsSynomSets(localeId: string): Promise<Set<string>[]> {
  const recipeFoods = await RecipeFoods.findAll({
    attributes: ['recipeWord'],
    where: { localeId },
    include: [{ model: SynonymSet, attributes: ['synonyms'] }],
  });
  return recipeFoods.map((recipeFoodEntry) =>
    parseSynonymSet(
      recipeFoodEntry.recipeWord.concat(' ', recipeFoodEntry.synonyms?.synonyms ?? '')
    )
  );
}

/**
 * Build special foods list for a given locale
 * @param {string} localeId - food Locale
 * @returns {Promise<Map<string, RecipeFood>[]>} special foods list
 */
async function getRecipeFoodsList(localeId: string): Promise<RecipeFoodTuple[]> {
  const recipeFoods = await RecipeFoods.findAll({
    attributes: ['code', 'name', 'recipeWord'],
    where: { localeId },
    include: [{ model: SynonymSet, attributes: ['synonyms'] }],
  });

  const recipeFoodsList: RecipeFoodTuple[] = [];
  recipeFoods.map((recipeFoodEntry: RecipeFoods) =>
    recipeFoodsList.push([
      recipeFoodEntry.name.toLowerCase(),
      {
        code: recipeFoodEntry.code,
        name: recipeFoodEntry.name.toLowerCase(),
        recipeWord: recipeFoodEntry.recipeWord,
        synonyms: parseSynonymSet(
          recipeFoodEntry.recipeWord.concat(' ', recipeFoodEntry.synonyms?.synonyms ?? '')
        ),
        // TODO: add Localised description to special foods
        description: recipeFoodEntry.name.toLocaleLowerCase(),
      },
    ])
  );
  return recipeFoodsList;
}

async function getLanguageBackendId(localeId: string): Promise<string> {
  const row = await FoodsLocale.findOne({
    attributes: ['foodIndexLanguageBackendId'],
    where: { id: localeId },
  });

  if (!row) throw new NotFoundError(`Locale "${localeId}" not found`);

  return row.foodIndexLanguageBackendId;
}

// Building index for each locale
async function buildIndexForLocale(localeId: string): Promise<LocalFoodIndex> {
  const foodList = await FoodLocalList.findAll({ attributes: ['foodCode'], where: { localeId } });

  const foodCodes = foodList.map((row) => row.foodCode);

  // FIXME: requests should be limited to a constant amount of rows (paginated)
  const [
    localFoods,
    localCategories,
    synonymSets,
    recipeFoodsSynomSet,
    languageBackendId,
    recipeFoodslist,
  ] = await Promise.all([
    FoodLocal.findAll({
      where: { foodCode: foodCodes, localeId },
      include: {
        required: true,
        association: 'main',
        attributes: ['code'],
        include: [{ association: 'parentCategories', where: { isHidden: false } }],
      },
    }),
    CategoryLocal.findAll({
      where: { localeId },
      include: {
        required: true,
        association: 'main',
        attributes: ['code'],
        where: { isHidden: false },
        include: [{ association: 'parentCategories', where: { isHidden: false } }],
      },
    }),
    getSynonymSets(localeId),
    getRecipeFoodsSynomSets(localeId),
    getLanguageBackendId(localeId),
    getRecipeFoodsList(localeId),
  ]);

  const languageBackend = LanguageBackends[languageBackendId];

  if (!languageBackend)
    throw new NotFoundError(
      `Language backend "${languageBackendId}" for locale "${localeId}" not found`
    );

  const foodDescriptions = new Array<PhraseWithKey<string>>();

  for (const food of localFoods) {
    if (!food.name) continue;

    foodDescriptions.push({ phrase: food.name, key: food.foodCode });
  }

  const categoryDescriptions = new Array<PhraseWithKey<string>>();

  for (const category of localCategories) {
    if (!category.name) continue;

    categoryDescriptions.push({ phrase: category.name, key: category.categoryCode });
  }

  const foodIndex = new PhraseIndex<string>(
    foodDescriptions,
    LanguageBackends[languageBackendId],
    synonymSets,
    recipeFoodsSynomSet,
    recipeFoodslist
  );

  const categoryIndex = new PhraseIndex<string>(
    categoryDescriptions,
    LanguageBackends[languageBackendId],
    synonymSets
  );

  return {
    foodIndex,
    categoryIndex,
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
  query: SearchQuery
): Promise<FoodHeader[]> {
  const localeIndex = foodIndex[query.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.localeId} does not exist or is not enabled`);
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
    const temp = acc.find((item) => item.code === current.code);
    if (!temp) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as FoodHeader[]);
  return recipeFoodHeadersFiltered;
}

async function queryIndex(query: SearchQuery): Promise<FoodSearchResponse> {
  const localeIndex = foodIndex[query.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.localeId} does not exist or is not enabled`);

  const foodInterpretation = localeIndex.foodIndex.interpretPhrase(
    query.description,
    'match-fewer',
    'foods'
  );
  const foodInterpretedRecipeFoods = localeIndex.foodIndex.interpretPhrase(
    query.description,
    'match-fewer',
    'recipes'
  );
  let recipeFoodsHeaders: FoodHeader[] = [];
  if (foodInterpretedRecipeFoods.words.length > 0) {
    recipeFoodsHeaders = await matchRecipeFoods(foodInterpretedRecipeFoods, query);
  }
  const foodResults = localeIndex.foodIndex.findMatches(foodInterpretation, 100, 100);

  const categoryInterpretation = localeIndex.categoryIndex.interpretPhrase(
    query.description,
    'match-fewer',
    'categories'
  );

  const categoryResults = localeIndex.categoryIndex.findMatches(categoryInterpretation, 100, 100);

  const foods = await rankFoodResults(
    foodResults,
    query.localeId,
    query.rankingAlgorithm,
    query.matchScoreWeight,
    logger,
    recipeFoodsHeaders
  );

  const categories = rankCategoryResults(categoryResults);

  return {
    foods,
    categories,
  };
}

const cleanUpIndexBuilder = async () => Promise.all([foodsDb.close(), systemDb.close()]);

async function buildIndex() {
  let enabledLocales: string[];

  if (config.enabledLocales === null) {
    const allLocales = await FoodsLocale.findAll({ attributes: ['id'] });
    enabledLocales = allLocales.map((l) => l.id);
  } else {
    enabledLocales = config.enabledLocales;
  }

  logger.debug(`Enabled locales: ${JSON.stringify(enabledLocales)}`);

  // Ideally this needs to be done on parallel threads, not sure if worth it in node.js
  for (const localeId of enabledLocales) {
    logger.debug(`Indexing ${localeId}`);
    foodIndex[localeId] = await buildIndexForLocale(localeId);
  }

  parentPort.postMessage('ready');

  parentPort.on('message', async (msg: SearchQuery) => {
    if (msg.exit) {
      await cleanUpIndexBuilder();
      logger.debug('Closing index builder');
      process.exit(0);
    }

    try {
      const results = await queryIndex(msg);

      parentPort.postMessage({
        queryId: msg.queryId,
        success: true,
        results,
      });
    } catch (err) {
      parentPort.postMessage({
        queryId: msg.queryId,
        success: false,
        error: err,
      });
    }
  });
}

(async () => {
  await buildIndex();
})().catch((err) => {
  logger.error(err);
});
