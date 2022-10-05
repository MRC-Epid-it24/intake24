import { Worker } from 'worker_threads';

import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';
import config from '@intake24/api/config';

let indexReady = false;
let queryIdCounter = 0;
let indexWorker: Worker;

export class IndexNotReadyError extends Error {}

interface SearchResponse {
  queryId: number;
  success: boolean;
  results: FoodHeader[];
  error: Error;
}

export default {
  async init(): Promise<void> {
    // eslint-disable-next-line no-new
    indexWorker = new Worker('./dist/foodIndexBuilder.js', {
      workerData: { dbConnectionInfo: config.database[config.app.env].foods },
    });

    const readyListener = (msg: any) => {
      if (msg === 'ready') {
        indexReady = true;
        indexWorker.removeListener('message', readyListener);
      }
    };

    indexWorker.on('message', readyListener);
  },

  async close(): Promise<void> {
    await indexWorker.terminate();
  },

  async search(
    description: string,
    localeId: string,
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
          matchScoreWeight,
        });
      });
    }

    return Promise.reject(new IndexNotReadyError());
  },
};
