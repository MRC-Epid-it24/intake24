import { Worker } from 'node:worker_threads';

import type { SpecialFood } from '@intake24/common/types/foods';
import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';
import config from '@intake24/api/config';
import { SpecialFoods } from '@intake24/db/models';

let indexReady = false;
let queryIdCounter = 0;
let specialQueryIdCounter = 0;
let indexWorker: Worker;

export class IndexNotReadyError extends Error {}

interface SearchResponse {
  queryId: number;
  success: boolean;
  results: FoodHeader[];
  error: Error;
}

interface SpecialFoodResponse {
  specialQueryId: number;
  success: boolean;
  result: SpecialFood;
  error: Error;
}

export default {
  async init(): Promise<void> {
    // eslint-disable-next-line no-new
    indexWorker = new Worker('./dist/foodIndexBuilder.js', {
      workerData: {
        dbConnectionInfo: config.database[config.app.env],
      },
    });

    const readyListener = (msg: any) => {
      if (msg === 'ready') {
        indexReady = true;
        indexWorker.removeListener('message', readyListener);
      }
    };

    indexWorker.on('message', readyListener);
    indexWorker.on('error', (err) => {
      console.error(err);
    });
  },

  close() {
    indexWorker.postMessage({ exit: true });
  },

  /**
   * get special food and its steps by given locale and code
   * @param localeId - locale Code of the food index
   * @param code - code of the special food
   * @returns { SpecialFood }
   */
  async getSpecialFood(localeId: string, code: string): Promise<SpecialFoods> {
    if (indexReady) {
      specialQueryIdCounter++;

      // TODO: implement via the food index by adding a new query type and a message handling/switching between message types
      const result = await SpecialFoods.findOne({
        where: { localeId, code },
        attributes: ['code', 'name', 'localeId', 'specialWords', 'synonyms'],
        include: {
          association: 'steps',
          attributes: ['code', 'name', 'description', 'order', 'localeId', 'categoryCode'],
          order: ['order', 'ASC'],
        },
      });

      if (result) {
        return result;
      } else {
        return Promise.reject(new Error('Special food not found'));
      }
    }
    return Promise.reject(new IndexNotReadyError());
  },

  async search(
    description: string,
    localeId: string,
    rankingAlgorithm: string,
    matchScoreWeight: number
  ): Promise<FoodSearchResponse> {
    if (indexReady) {
      queryIdCounter += 1;

      return new Promise((resolve, reject) => {
        const queryId = queryIdCounter;

        const listener = (msg: SearchResponse) => {
          if (msg.queryId === queryId) {
            indexWorker.removeListener('message', listener);

            if (msg.success) {
              resolve({ foods: msg.results });
            } else {
              reject(msg.error);
            }
          }
        };

        indexWorker.on('message', listener);

        indexWorker.postMessage({
          queryId,
          description,
          localeId,
          rankingAlgorithm,
          matchScoreWeight: matchScoreWeight / 100.0,
        });
      });
    }

    return Promise.reject(new IndexNotReadyError());
  },
};
