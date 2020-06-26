import Vue from 'vue';
import { ActionTree } from 'vuex';
import { FilterState, RootState } from '@/types/vuex';

const actions: ActionTree<FilterState, RootState> = {
  set({ commit, state, getters }, payload) {
    commit('set', payload);
    Vue.ls.set(getters.lsKey, state.data, 24 * 60 * 60 * 1000);
  },
  add({ commit, state, getters }, payload) {
    commit('add', payload);
    Vue.ls.set(getters.lsKey, state.data, 24 * 60 * 60 * 1000);
  },
  reset({ commit, getters }) {
    commit('reset');
    Vue.ls.remove(getters.lsKey);
  },
};

export default actions;
