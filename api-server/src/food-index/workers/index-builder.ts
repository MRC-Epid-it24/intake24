import { Sequelize } from 'sequelize-typescript';
import { parentPort, workerData } from 'worker_threads';
import { FoodLocal, FoodLocalList } from '@/db/models/foods';
import config from '@/config/app';
import * as foods from '@/db/models/foods';
import Metaphone3Encoder from '@/food-index/metaphone-encoder';
import { PhraseIndex, PhraseWithKey } from '@/food-index/phrase-index';
import EnglishWordOps from '@/food-index/english-word-ops';
import { dbLogger } from '@/services/logger';

const db = new Sequelize({
  ...workerData.dbConnectionInfo,
  models: Object.values(foods),
  logging: config.env === 'development' ? dbLogger : false,
});

let foodIndex: PhraseIndex<string>;

async function buildIndex() {
  const foodList = await FoodLocalList.findAll({
    attributes: ['foodCode'],
    where: {
      localeId: 'en_GB',
    },
  });

  const foodCodes = foodList.map((row) => row.foodCode);

  const localFoods = await FoodLocal.findAll({
    where: {
      foodCode: foodCodes,
      localeId: 'en_GB',
    },
  });

  const foodDescriptions = new Array<PhraseWithKey<string>>();

  for (const food of localFoods) {
    foodDescriptions.push({ phrase: food.name, key: food.foodCode });
  }

  foodIndex = new PhraseIndex<string>(
    foodDescriptions,
    ['with'],
    new Metaphone3Encoder(),
    new EnglishWordOps(),
    new Array(
      new Set<string>(['banana', 'dog', 'helicopter'])
    )
  );

  parentPort!.postMessage('ready');

  parentPort!.on('message', (msg) => {
    const interpreted = foodIndex.interpretPhrase(msg.query, 'match-fewer');

    const results = foodIndex.findMatches(interpreted, 100, 100).map((m) => ({
      code: m.key,
      description: m.phrase,
    }));

    parentPort!.postMessage({
      queryId: msg.queryId,
      results,
    });
  });
}

buildIndex();
