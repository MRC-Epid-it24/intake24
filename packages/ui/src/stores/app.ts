import trim from 'lodash/trim';
import { defineStore } from 'pinia';

import type { I18nLanguageListEntry } from '@intake24/common/types/http';

export type AppState = {
  lang: string;
  langs: I18nLanguageListEntry[];
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
    lang: navigator.language || navigator.userLanguage,
    langs: [],
    app: {
      name: import.meta.env.VITE_APP_NAME,
      host: window.location.host,
      api: [import.meta.env.VITE_API_HOST, import.meta.env.VITE_API_URL]
        .map((item) => trim(item, '/'))
        .join('/'),
      build: {
        version: import.meta.env.VITE_APP_BUILD_VERSION,
        revision: import.meta.env.VITE_APP_BUILD_REVISION,
        date: import.meta.env.VITE_APP_BUILD_DATE,
      },
    },
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}app`,
    paths: ['lang'],
  },
  actions: {
    setLanguage(language: string) {
      this.lang = language;
    },
    setLanguages(languages: I18nLanguageListEntry[]) {
      this.langs = languages;
    },
  },
});

export type AppStoreDef = typeof useApp;

export type AppStore = ReturnType<AppStoreDef>;
