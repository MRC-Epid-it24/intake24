import '@intake24/api/bootstrap';

import { parentPort as parentPortNullable, workerData } from 'node:worker_threads';

import type { PhraseWithKey, SpecialFoodTuple } from '@intake24/api/food-index/phrase-index';
import type { SearchQuery } from '@intake24/api/food-index/search-query';
import type { FoodHeader } from '@intake24/common/types/http';
import config from '@intake24/api/config/app';
import LanguageBackends from '@intake24/api/food-index/language-backends';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { rankSearchResults } from '@intake24/api/food-index/ranking/ranking';
import { NotFoundError } from '@intake24/api/http/errors';
import { logger as servicesLogger } from '@intake24/common-backend';
import {
  databaseLogQuery,
  FoodLocal,
  FoodLocalList,
  FoodsLocale,
  models,
  SequelizeTS,
  SpecialFoods,
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

interface FoodIndex {
  [key: string]: PhraseIndex<string>;
}

const foodIndex: FoodIndex = {};

const logger = servicesLogger.child({ service: 'Food index' });

function parseSynonymSet(value: string): Set<string> {
  const resultSet = new Set<string>(
    value
      .trim()
      .split(' ')
      .filter((s) => s.length > 0)
  );
  logger.debug(`\n\nParsed synonym set: ${value} => ${Array.from(resultSet).join(', ')}\n\n`);
  return resultSet;
}

async function getSynonymSets(localeId: string): Promise<Set<string>[]> {
  const synSets = await SynonymSet.findAll({ attributes: ['synonyms'], where: { localeId } });
  return synSets.map((s) => parseSynonymSet(s.synonyms));
}

async function getSpecialFoodsSynomSets(localeId: string): Promise<Set<string>[]> {
  const specialFoods = await SpecialFoods.findAll({
    attributes: ['synonyms', 'specialWords'],
    where: { localeId },
  });
  return specialFoods.map((specFoodEntry) =>
    parseSynonymSet(specFoodEntry.specialWords.concat(' ', specFoodEntry.synonyms))
  );
}

/**
 * Build special foods list for a given locale
 * @param {string} localeId - food Locale
 * @returns {Promise<Map<string, SpecialFood>[]>} special foods list
 */
async function getspecialFoodsList(localeId: string): Promise<SpecialFoodTuple[]> {
  const specialFoods = await SpecialFoods.findAll({
    attributes: ['code', 'name', 'specialWords', 'synonyms'],
    where: { localeId },
  });

  const specialFoodsList: SpecialFoodTuple[] = [];
  specialFoods.map((specFoodEntry: SpecialFoods) =>
    specialFoodsList.push([
      specFoodEntry.name.toLowerCase(),
      {
        code: specFoodEntry.code,
        name: specFoodEntry.name.toLowerCase(),
        specialWords: specFoodEntry.specialWords,
        synonyms: parseSynonymSet(specFoodEntry.specialWords.concat(' ', specFoodEntry.synonyms)),
        // TODO: add Localised description to special foods
        description: specFoodEntry.name.toLocaleLowerCase(),
      },
    ])
  );
  return specialFoodsList;
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
async function buildIndexForLocale(localeId: string): Promise<PhraseIndex<string>> {
  const foodList = await FoodLocalList.findAll({ attributes: ['foodCode'], where: { localeId } });

  const foodCodes = foodList.map((row) => row.foodCode);
  const [localFoods, synonymSets, specialFoodsSynomSet, languageBackendId, specialFoodslist] =
    await Promise.all([
      FoodLocal.findAll({
        where: { foodCode: foodCodes, localeId },
        include: {
          required: true,
          association: 'main',
          attributes: ['code'],
          include: [{ association: 'parentCategories', where: { isHidden: false } }],
        },
      }),
      getSynonymSets(localeId),
      getSpecialFoodsSynomSets(localeId),
      getLanguageBackendId(localeId),
      getspecialFoodsList(localeId),
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

  return new PhraseIndex<string>(
    foodDescriptions,
    LanguageBackends[languageBackendId],
    synonymSets,
    specialFoodsSynomSet,
    specialFoodslist
  );
}

/**
 * Function for checking interpreted query against the Special Foods Set and returning the result
 * @param interpretedQuery {InterpretedPhrase} - interpreted query
 * @param query {SearchQuery} - search query
 * @returns FoodHeader[] - array of FoodHeaders of special foods
 */

async function matchSpecialFoods(
  interpretedQuery: InterpretedPhrase,
  query: SearchQuery
): Promise<FoodHeader[]> {
  const localeIndex = foodIndex[query.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.localeId} does not exist or is not enabled`);
  const specialFoodsTuples = localeIndex.specialFoodsList;
  const specialFoodHeaders: FoodHeader[] = [];

  // TODO: Optimise the performance of this function
  for (const specialFood of specialFoodsTuples) {
    interpretedQuery.words.forEach((word) => {
      const asTypedExactMatch = specialFood[1].synonyms.has(word.asTyped);
      word.interpretations.forEach((interpretation) => {
        if (specialFood[1].synonyms.has(interpretation.dictionaryWord) || asTypedExactMatch) {
          return specialFoodHeaders.push({
            code: specialFood[1].code,
            description: specialFood[1].description,
          });
        }
      });
    });
  }

  const specialFoodHeadersFiltered: FoodHeader[] = specialFoodHeaders.reduce((acc, current) => {
    const temp = acc.find((item) => item.code === current.code);
    if (!temp) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as FoodHeader[]);
  return specialFoodHeadersFiltered;
}

async function queryIndex(query: SearchQuery): Promise<FoodHeader[]> {
  const localeIndex = foodIndex[query.localeId];
  if (!localeIndex)
    throw new NotFoundError(`Locale ${query.localeId} does not exist or is not enabled`);

  const interpreted = localeIndex.interpretPhrase(query.description, 'match-fewer');
  let specialFoodsHeaders: FoodHeader[] = [];
  if (interpreted.words.length > 0) {
    specialFoodsHeaders = await matchSpecialFoods(interpreted, query);
  }

  const results = localeIndex.findMatches(interpreted, 100, 100);

  return rankSearchResults(
    results,
    query.localeId,
    query.rankingAlgorithm,
    query.matchScoreWeight,
    logger,
    specialFoodsHeaders
  );
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
