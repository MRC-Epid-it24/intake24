import { Worker } from 'worker_threads';
import config from '@/config';

let indexReady = false;
let queryIdCounter = 0;
let indexWorker: Worker;

export interface FoodSearchResult {
  code: string;
  description: string;
}

export class IndexNotReadyError extends Error {}

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

  async search(query: string): Promise<FoodSearchResult[]> {
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
