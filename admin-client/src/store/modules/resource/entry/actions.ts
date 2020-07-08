import { ActionTree } from 'vuex';
import { EntryState, RootState } from '@/types/vuex';
import http from '@/services/http.service';

const actions: ActionTree<EntryState, RootState> = {
  async request({ commit, state }, { id, path, query }) {
    const { name } = state;
    commit('request');
    commit('loading/add', `${name}/entry`, { root: true });

    try {
      let url = `v3/admin/${name}/${id}`;
      if (path) url += `/${path}`;

      const res = await http.get(url, { params: query });
      commit('success', res);
    } catch (err) {
      commit('error', err);
    } finally {
      commit('loading/remove', `${name}/entry`, { root: true });
    }
  },
};

export default actions;
