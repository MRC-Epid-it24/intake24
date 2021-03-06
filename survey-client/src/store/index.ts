import trim from 'lodash/trim';
import Vue from 'vue';
import Vuex, { GetterTree } from 'vuex';
import { RootState } from '@/types/vuex';
import modules from './modules';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const defaultState = (): RootState => ({
  lang: document.documentElement.lang.substr(0, 2),
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
});

const getters: GetterTree<RootState, RootState> = {
  lang: (state) => state.lang,
  app: (state) => state.app,
};

export default new Vuex.Store<RootState>({
  state: defaultState(),
  getters,
  modules,
  strict: debug,
});
