import { ActionTree } from 'vuex';
import { EntryState, RootState } from '@/types/vuex';
import http from '@/services/http.service';

const actions: ActionTree<EntryState, RootState> = {
  async request({ commit, state }, { id, query }) {
    const { name } = state;
    commit('request');
    commit('loading/add', `${name}/entry`, { root: true });

    try {
      const res = await http.get(`v3/admin/${name}/${id}`, { params: query });
      commit('success', res);
    } catch (err) {
      commit('error', err);
    } finally {
      commit('loading/remove', `${name}/entry`, { root: true });
    }
  },
};

export default actions;
