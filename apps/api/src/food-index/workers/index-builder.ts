import { parentPort, workerData } from 'worker_threads';

import type { PhraseWithKey } from '@intake24/api/food-index/phrase-index';
import config from '@intake24/api/config/app';
import EnglishWordOps from '@intake24/api/food-index/english-word-ops';
import Metaphone3Encoder from '@intake24/api/food-index/metaphone-encoder';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { FoodLocal, FoodLocalList, models, SequelizeTS } from '@intake24/db';
import { dbLogger } from '@intake24/services';

const db = new SequelizeTS({
  ...workerData.dbConnectionInfo,
  models: Object.values(models.foods),
  logging: config.env === 'development' ? dbLogger : false,
});

let foodIndex: PhraseIndex<string>;

async function buildIndex() {
  const foodList = await FoodLocalList.findAll({
    attributes: ['foodCode'],
    where: { localeId: 'en_GB' },
  });

  const foodCodes = foodList.map((row) => row.foodCode);

  const localFoods = await FoodLocal.findAll({ where: { foodCode: foodCodes, localeId: 'en_GB' } });

  const foodDescriptions = new Array<PhraseWithKey<string>>();

  for (const food of localFoods) {
    if (!food.name) continue;

    foodDescriptions.push({ phrase: food.name, key: food.foodCode });
  }

  foodIndex = new PhraseIndex<string>(
    foodDescriptions,
    ['with'],
    new Metaphone3Encoder(),
    new EnglishWordOps(),
    new Array(new Set<string>(['banana', 'dog', 'helicopter']))
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

  parentPort!.on('exit', async () => {
    await db.close();
  });
}

(async () => {
  await buildIndex();
})().catch((err) => {
  console.log(err);
});
