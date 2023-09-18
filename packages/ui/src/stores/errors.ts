import axios from 'axios';
import { defineStore } from 'pinia';

import { useMessages } from './messages';

export type VueError = {
  err: Error;
  info: string;
};

export type ErrorsState = {
  items: VueError[];
};

export const useErrors = defineStore('errors', {
  state: (): ErrorsState => ({ items: [] }),
  actions: {
    captureError(err: Error, vm: Vue, info: string) {
      this.processError(err, vm, info);
    },

    processError(err: Error, vm: Vue, info: string) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        if (response) {
          if ([401, 422].includes(response.status)) return;

          /* if (response.status === 429) {
            const retryAfter = parseInt(response.headers['retry-after']?.toString() ?? '60', 10);
          } */

          const { data: { message } = {} } = response;
          useMessages().error(message ?? err.message);
        } else useMessages().error(err.message);

        return;
      }

      useMessages().error(err.message);
      console.error(err);
      console.error(vm);
      console.error(info);

      // TODO: subscribe to store in both apps and send relevant errors to backend
      // this.items.push({ err, info });
    },

    captureWarn(msg: string, vm: Vue, trace: string) {
      this.processWarn(msg, vm, trace);
    },

    processWarn(msg: string, vm: Vue, trace: string) {
      console.warn(msg);
      console.warn(vm);
      console.warn(trace);
    },
  },
});

export type ErrorsStoreDef = typeof useErrors;

export type ErrorsStore = ReturnType<ErrorsStoreDef>;
