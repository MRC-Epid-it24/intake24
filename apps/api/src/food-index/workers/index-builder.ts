import { parentPort as parentPortNullable, workerData } from 'worker_threads';

import type { PhraseWithKey } from '@intake24/api/food-index/phrase-index';
import config from '@intake24/api/config/app';
import EnglishWordOps from '@intake24/api/food-index/english-word-ops';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { NotFoundError } from '@intake24/api/http/errors';
import { FoodLocal, FoodLocalList, models, SequelizeTS, SynonymSet } from '@intake24/db';
import Locale from '@intake24/db/models/foods/locale';
import { dbLogger, logger as servicesLogger } from '@intake24/services';

if (parentPortNullable === null) throw new Error('This file can only be run as a worker thread');

const parentPort = parentPortNullable;

const db = new SequelizeTS({
  ...workerData.dbConnectionInfo,
  models: Object.values(models.foods),
  logging: config.env === 'development' ? dbLogger : false,
});

interface FoodIndex {
  [key: string]: PhraseIndex<string>;
}

const foodIndex: FoodIndex = {};

const logger = servicesLogger.child({ service: 'Food index' });

function parseSynonymSet(value: string): Set<string> {
  return new Set<string>(value.trim().split('\\s+'));
}

async function getSynonymSets(localeId: string): Promise<Set<string>[]> {
  const synSets = await SynonymSet.findAll({ attributes: ['synonyms'], where: { localeId } });
  return synSets.map((s) => parseSynonymSet(s.synonyms));
}

async function buildIndexForLocale(localeId: string): Promise<PhraseIndex<string>> {
  const foodList = await FoodLocalList.findAll({
    attributes: ['foodCode'],
    where: { localeId },
  });

  const foodCodes = foodList.map((row) => row.foodCode);

  const localFoods = await FoodLocal.findAll({ where: { foodCode: foodCodes, localeId } });

  const synonymSets = await getSynonymSets(localeId);

  const foodDescriptions = new Array<PhraseWithKey<string>>();

  for (const food of localFoods) {
    if (!food.name) continue;

    foodDescriptions.push({ phrase: food.name, key: food.foodCode });
  }

  return new PhraseIndex<string>(foodDescriptions, EnglishWordOps, synonymSets);
}

async function buildIndex() {
  let enabledLocales: string[];

  if (config.enabledLocales === null) {
    const allLocales = await Locale.findAll({ attributes: ['id'] });
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

  parentPort.on('message', (msg) => {
    const { localeId } = msg;

    const localeIndex = foodIndex[localeId];

    if (!localeIndex)
      throw new NotFoundError(`Locale ${localeId} does not exist or is not enabled`);

    const interpreted = localeIndex.interpretPhrase(msg.query, 'match-fewer');

    const results = localeIndex.findMatches(interpreted, 100, 100).map((m) => ({
      code: m.key,
      description: m.phrase,
    }));

    parentPort.postMessage({
      queryId: msg.queryId,
      results,
    });
  });

  parentPort.on('exit', async () => {
    await db.close();
  });
}

(async () => {
  await buildIndex();
})().catch((err) => {
  console.log(err);
});
