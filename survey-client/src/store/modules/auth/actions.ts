import { ActionTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';
import authSvc, { LoginRequest, TokenRequest } from '@/services/auth.service';

type AuthenticatePayload = {
  type: 'login' | 'token';
  payload: LoginRequest & TokenRequest;
};

const actions: ActionTree<AuthState, RootState> = {
  async login({ dispatch }, payload) {
    await dispatch('authenticate', { type: 'login', payload });
  },

  async token({ dispatch }, payload) {
    await dispatch('authenticate', { type: 'token', payload });
  },

  async authenticate({ commit, dispatch }, { type, payload }: AuthenticatePayload) {
    commit('request');
    commit('loading/add', 'login', { root: true });

    try {
      const accessToken = await authSvc[type](payload);
      commit('login', accessToken);
      await dispatch('user/load', {}, { root: true });
      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return Promise.reject(err);
    } finally {
      commit('loading/remove', 'login', { root: true });
    }
  },

  async refresh({ commit, dispatch }, { withErr = true } = {}) {
    try {
      const accessToken = await authSvc.refresh();
      commit('refresh', accessToken);
      await dispatch('user/load', {}, { root: true });
      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return withErr ? Promise.reject(err) : Promise.resolve();
    }
  },

  async logout({ commit }, { invalidate }) {
    if (invalidate) await authSvc.logout();

    commit('loading/reset', {}, { root: true });
    commit('user/reset', {}, { root: true });
    commit('logout');
  },
};

export default actions;
