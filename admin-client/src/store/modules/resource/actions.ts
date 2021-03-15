import Vue from 'vue';
import { ActionTree } from 'vuex';
import { ListState, RootState } from '@/types/vuex';
import http from '@/services/http.service';
import { FILTER_LS_KEY } from './state';

const actions: ActionTree<ListState, RootState> = {
  async update({ commit }, resource) {
    commit('update', resource);
  },

  async request({ commit, state }) {
    const { name } = state;
    commit('request');
    commit('loading/add', `${name}/refs`, { root: true });

    http
      .get(`${name}/refs`, { withErr: true })
      .then((res) => commit('success', res))
      .catch((err) => commit('error', err))
      .finally(() => commit('loading/remove', `${name}/refs`, { root: true }));
  },

  async setFilter({ commit, state }, payload) {
    commit('setFilter', payload);
    Vue.ls.set(FILTER_LS_KEY, state.filter, 24 * 60 * 60 * 1000);
  },

  async resetFilter({ commit, state }) {
    commit('resetFilter');
    Vue.ls.set(FILTER_LS_KEY, state.filter, 24 * 60 * 60 * 1000);
  },
};

export default actions;
