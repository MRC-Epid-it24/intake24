import { ActionTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';
import authSvc, { LoginRequest } from '@/services/auth.service';

const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, dispatch }, payload: LoginRequest) {
    commit('request');
    commit('loading/add', 'login', { root: true });

    try {
      const { accessToken, mfa } = await authSvc.login(payload);

      if (accessToken) await dispatch('successfulLogin', { accessToken });
      if (mfa) commit('mfa', mfa);

      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return Promise.reject(err);
    } finally {
      commit('loading/remove', 'login', { root: true });
    }
  },

  async verify({ commit, dispatch }, sigResponse: string) {
    commit('request');
    commit('loading/add', 'verify', { root: true });

    try {
      const accessToken = await authSvc.verify(sigResponse);
      await dispatch('successfulLogin', { accessToken });
      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return Promise.reject(err);
    } finally {
      commit('loading/remove', 'verify', { root: true });
    }
  },

  async successfulLogin({ commit, dispatch }, { accessToken }) {
    commit('login', accessToken);
    await dispatch('user/request', {}, { root: true });
  },

  async refresh({ commit, dispatch, rootGetters }, { withErr = true } = {}) {
    try {
      const accessToken = await authSvc.refresh();
      commit('refresh', accessToken);

      if (!rootGetters['user/loaded']) await dispatch('user/request', {}, { root: true });

      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return withErr ? Promise.reject(err) : Promise.resolve();
    }
  },

  async logout({ commit }, { invalidate } = {}) {
    if (invalidate) await authSvc.logout();

    commit('loading/reset', {}, { root: true });
    commit('user/reset', {}, { root: true });
    commit('logout');
  },
};

export default actions;
