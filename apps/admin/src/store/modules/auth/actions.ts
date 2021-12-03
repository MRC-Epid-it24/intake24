import { ActionTree } from 'vuex';
import { AuthState, RootState } from '@/types';
import authSvc, { LoginRequest, MFAVerifyRequest } from '@/services/auth.service';

const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, dispatch }, payload: LoginRequest) {
    commit('loading/add', 'login', { root: true });

    try {
      const data = await authSvc.login(payload);

      if ('accessToken' in data)
        await dispatch('successfulLogin', { accessToken: data.accessToken });
      else commit('mfaRequest', data.mfaRequestUrl);

      return Promise.resolve();
    } catch (err) {
      commit('error', err);
      return Promise.reject(err);
    } finally {
      commit('loading/remove', 'login', { root: true });
    }
  },

  async verify({ commit, dispatch }, request: MFAVerifyRequest) {
    commit('loading/add', 'verify', { root: true });

    try {
      const accessToken = await authSvc.verify(request);
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
