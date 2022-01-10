import { ActionTree } from 'vuex';
import { Dictionary } from '@intake24/common/types';
import axios from 'axios';
import { EntryState, RootState } from '@intake24/admin/types';
import http from '@intake24/admin/services/http.service';

const actions: ActionTree<EntryState, RootState> = {
  async request({ commit, dispatch, rootGetters }, { id, query }) {
    const name = rootGetters['resource/name'];
    const api = rootGetters['resource/api'];
    commit('request');
    commit('loading/add', `${name}/entry`, { root: true });

    if (id === 'create') {
      commit('init');
      await dispatch('requestRefs');
      commit('loading/remove', `${name}/entry`, { root: true });
      return;
    }

    try {
      const { data } = await http.get(`${api}/${id}`, { params: query });
      await dispatch('update', data);
    } catch (err) {
      commit('error', err);
    } finally {
      commit('loading/remove', `${name}/entry`, { root: true });
    }
  },

  async update({ commit, dispatch }, data) {
    commit('update', data);
    await dispatch('requestRefs');
  },

  async requestRefs({ commit, dispatch, rootGetters }) {
    const name = rootGetters['resource/name'];
    const api = rootGetters['resource/api'];
    commit('requestRefs');
    commit('loading/add', `${name}/entry/refs`, { root: true });

    try {
      const { data } = await http.get(`${api}/refs`);
      dispatch('updateRefs', data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status !== 404) commit('error', err);
    } finally {
      commit('loading/remove', `${name}/entry/refs`, { root: true });
    }
  },

  async updateRefs({ commit }, refs?: Dictionary) {
    commit('updateRefs', refs);
  },
};

export default actions;
