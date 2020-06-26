import Vue from 'vue';
import Vuex, { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState } from '@/types/vuex';
import modules from './modules';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const defaultState = (): RootState => ({
  lang: document.documentElement.lang.substr(0, 2),
  module: null,
});

const getters: GetterTree<RootState, RootState> = {
  lang: (state) => state.lang,
  module: (state) => state.module,
};

const actions: ActionTree<RootState, RootState> = {
  module({ commit }, module) {
    commit('module', module);
  },
};

const mutations: MutationTree<RootState> = {
  module(state, module) {
    state.module = module;
  },
};

export default new Vuex.Store<RootState>({
  state: defaultState(),
  getters,
  actions,
  mutations,
  modules,
  strict: debug,
});
