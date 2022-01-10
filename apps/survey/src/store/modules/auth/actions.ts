import { ActionTree } from 'vuex';
import axios from 'axios';
import { AuthState, RootState } from '@intake24/survey/types/vuex';
import authSvc, { LoginRequest, TokenRequest } from '@intake24/survey/services/auth.service';

type LoginPayload = {
  type: 'login';
  payload: LoginRequest;
};

type TokenPayload = {
  type: 'token';
  payload: TokenRequest;
};

type AuthenticatePayload = LoginPayload | TokenPayload;

const actions: ActionTree<AuthState, RootState> = {
  async login({ dispatch }, payload: LoginPayload) {
    await dispatch('authenticate', { type: 'login', payload });
  },

  async token({ dispatch }, payload: TokenPayload) {
    await dispatch('authenticate', { type: 'token', payload });
  },

  async authenticate({ commit, dispatch }, payload: AuthenticatePayload) {
    commit('request');
    commit('loading/add', 'login', { root: true });

    try {
      // TS won't narrow the type
      // const accessToken = await authSvc[type](payload);
      const accessToken =
        payload.type === 'login'
          ? await authSvc.login(payload.payload)
          : await authSvc.token(payload.payload);

      commit('login', accessToken);
      await dispatch('user/load', { accessToken }, { root: true });
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err)) commit('error', err);
      return Promise.reject(err);
    } finally {
      commit('loading/remove', 'login', { root: true });
    }
  },

  async refresh({ commit, dispatch }, { withErr = true }: { withErr?: boolean } = {}) {
    try {
      const accessToken = await authSvc.refresh();
      commit('refresh', accessToken);
      await dispatch('user/load', { accessToken }, { root: true });
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err)) commit('error', err);
      return withErr ? Promise.reject(err) : Promise.resolve();
    }
  },

  async logout({ commit }, { invalidate }: { invalidate?: boolean } = {}) {
    if (invalidate) await authSvc.logout();

    commit('loading/reset', {}, { root: true });
    commit('user/reset', {}, { root: true });
    commit('logout');
  },
};

export default actions;
