import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';
import { LoadingState, RootState } from '@intake24/survey/types/vuex';

export const defaultState = (): LoadingState => ({ items: [] });

const getters: GetterTree<LoadingState, RootState> = {
  isLoading: (state) => !!state.items.length,
};

const actions: ActionTree<LoadingState, RootState> = {
  add: async ({ commit }, item) => commit('add', item),
  remove: async ({ commit }, item) => commit('remove', item),
  reset: async ({ commit }) => commit('reset'),
};

const mutations: MutationTree<LoadingState> = {
  add: (state, item) => state.items.push(item),
  remove: (state, item) => {
    state.items = state.items.filter((i) => i !== item);
  },
  reset: (state) => Object.assign(state, defaultState()),
};

const loading: Module<LoadingState, RootState> = {
  namespaced: true,
  state: defaultState(),
  getters,
  actions,
  mutations,
};

export default loading;
