import { ActionTree } from 'vuex';
import { ListState, RootState } from '@/types/vuex';
import http from '@/services/http.service';

const actions: ActionTree<ListState, RootState> = {
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
};

export default actions;
