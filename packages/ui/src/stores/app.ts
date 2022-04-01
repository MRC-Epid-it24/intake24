import trim from 'lodash/trim';
import { defineStore } from 'pinia';

export type AppState = {
  lang: string;
  app: {
    api: string;
    host: string;
    name: string;
    build: {
      version: string;
      revision: string;
      date: string;
    };
  };
};

export const useApp = defineStore('app', {
  state: (): AppState => ({
    lang: document.documentElement.lang.substring(0, 2),
    app: {
      name: process.env.VUE_APP_NAME,
      host: window.location.host,
      api: [process.env.VUE_APP_API_HOST, process.env.VUE_APP_API_URL]
        .map((item) => trim(item, '/'))
        .join('/'),
      build: {
        version: process.env.VUE_APP_BUILD_VERSION,
        revision: process.env.VUE_APP_BUILD_REVISION,
        date: process.env.VUE_APP_BUILD_DATE,
      },
    },
  }),
  persist: {
    key: `${process.env.VUE_APP_PREFIX ?? ''}app`,
    paths: ['lang'],
  },
  actions: {
    async setLanguage(language: string) {
      this.lang = language;
    },
  },
});
