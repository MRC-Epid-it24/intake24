import { ActionTree } from 'vuex';
import { RootState, UserState } from '@/types/vuex';
import http from '@/services/http.service';

const actions: ActionTree<UserState, RootState> = {
  async request({ commit }) {
    return new Promise((resolve, reject) => {
      commit('request');
      commit('loading/add', 'profile', { root: true });

      http
        .get('admin/user')
        .then((res) => {
          commit('success', res.data);
          resolve(res);
        })
        .catch((err) => {
          commit('error');
          reject(err);
        })
        .finally(() => commit('loading/remove', 'profile', { root: true }));
    });
  },
};

export default actions;
