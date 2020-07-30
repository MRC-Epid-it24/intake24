import { parentPort, workerData } from 'worker_threads';
import FoodLocalList from '@/db/models/foods/food-local-list';
import { Sequelize } from 'sequelize-typescript';
import foods from '@/db/models/foods';
import FoodLocal from '@/db/models/foods/food-local';
import Metaphone3Encoder from '@/food-index/metaphone-encoder';
import { PhraseIndex, PhraseWithKey } from '@/food-index/phrase-index';
import EnglishWordOps from '@/food-index/english-word-ops';
import food from '@/db/models/foods/food';

const db = new Sequelize({ ...workerData.dbConnectionInfo, models: Object.values(foods) });

let foodIndex: PhraseIndex<string>;

FoodLocalList.findAll({
  where: {
    localeId: 'en_GB',
  },
  include: [
    {
      model: FoodLocal,
      where: {
        localeId: 'en_GB',
      },
    },
  ],
})
  .then((foodLocal) => {
    const foodDescriptions = new Array<PhraseWithKey<string>>();

    for (const f of foodLocal) {
      if (f.foodLocal) {
        foodDescriptions.push({ phrase: f.foodLocal.localDescription, key: f.foodCode });
      }
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
  })
  .then(() => {
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
  });
