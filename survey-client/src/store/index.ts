import Vue from 'vue';
import Vuex, { GetterTree } from 'vuex';
import { RootState } from '@/types/vuex';
import modules from './modules';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const defaultState = (): RootState => ({
  lang: document.documentElement.lang.substr(0, 2),
});

const getters: GetterTree<RootState, RootState> = {
  lang: (state) => state.lang,
};

export default new Vuex.Store<RootState>({
  state: defaultState(),
  getters,
  modules,
  strict: debug,
});
