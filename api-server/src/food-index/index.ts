import { Worker } from 'worker_threads';
import databaseConfig from '@/config/database';
import appConfig from '@/config/app';

let indexReady = false;
let queryIdCounter = 0;
let indexWorker: Worker;

export interface FoodSearchResult {
  code: string;
  description: string;
}

export class IndexNotReadyError extends Error {}

export default {
  async init() {
    // eslint-disable-next-line no-new
    indexWorker = new Worker('./dist/foodIndexBuilder.js', {
      workerData: { dbConnectionInfo: databaseConfig[appConfig.env].foods },
    });

    const readyListener = (msg: any) => {
      if (msg === 'ready') {
        indexReady = true;
        indexWorker.removeListener('message', readyListener);
      }
    };

    indexWorker.on('message', readyListener);
  },

  async search(query: string): Promise<Array<FoodSearchResult>> {
    if (indexReady) {
      queryIdCounter += 1;

      return new Promise((resolve) => {
        const queryId = queryIdCounter;

        const listener = (msg: any) => {
          if (msg.queryId === queryId) {
            indexWorker.removeListener('message', listener);
            resolve(msg.results);
          }
        };

        indexWorker.on('message', listener);

        indexWorker.postMessage({
          queryId,
          query,
        });
      });
    }

    return Promise.reject(new IndexNotReadyError());
  },
};
