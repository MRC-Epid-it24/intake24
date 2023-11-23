import { Worker } from 'node:worker_threads';

import type { RecipeFood } from '@intake24/common/types/foods';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import config from '@intake24/api/config';
import { RecipeFoods } from '@intake24/db/models';

let indexReady = false;
let queryIdCounter = 0;
let specialQueryIdCounter = 0;
let indexWorker: Worker;

export class IndexNotReadyError extends Error {}

interface SearchResponse {
  queryId: number;
  success: boolean;
  results: FoodSearchResponse;
  error: Error;
}

interface RecipeFoodResponse {
  specialQueryId: number;
  success: boolean;
  result: RecipeFood;
  error: Error;
}

export default {
  async init(): Promise<void> {
    // eslint-disable-next-line no-new
    indexWorker = new Worker('./dist/foodIndexBuilder.js', {
      workerData: {
        env: config.app.env,
        dbConnectionInfo: config.database,
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
   * get recipe food and its steps by given locale and code
   * @param localeId - locale Code of the food index
   * @param code - code of the special food
   * @returns { RecipeFood }
   */
  // TODO: shouldn't be here in index.ts
  async getRecipeFood(localeId: string, code: string): Promise<RecipeFoods> {
    if (indexReady) {
      specialQueryIdCounter++;

      // TODO: implement via the food index by adding a new query type and a message handling/switching between message types
      const result = await RecipeFoods.findOne({
        where: { localeId, code },
        attributes: ['code', 'name', 'localeId', 'recipeWord', 'synonyms_id'],
        include: [
          {
            required: true,
            association: 'steps',
            attributes: [
              'code',
              'name',
              'description',
              'order',
              'localeId',
              'categoryCode',
              'repeatable',
            ],
          },
          {
            required: true,
            association: 'synonyms',
            attributes: ['synonyms'],
          },
        ],
        order: [['steps', 'order', 'ASC']],
      });

      if (result) {
        return result;
      } else {
        throw new Error('Recipe food not found');
      }
    }
    throw new IndexNotReadyError();
  },

  async search(
    description: string,
    localeId: string,
    rankingAlgorithm: string,
    matchScoreWeight: number,
    includeHidden: boolean,
    limitToCategory?: string
  ): Promise<FoodSearchResponse> {
    if (indexReady) {
      queryIdCounter += 1;

      return new Promise((resolve, reject) => {
        const queryId = queryIdCounter;

        const listener = (msg: SearchResponse) => {
          if (msg.queryId === queryId) {
            indexWorker.removeListener('message', listener);

            if (msg.success) {
              resolve(msg.results);
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
          includeHidden,
          limitToCategory,
        });
      });
    }

    return Promise.reject(new IndexNotReadyError());
  },
};
