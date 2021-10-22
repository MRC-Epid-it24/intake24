import { MutationTree } from 'vuex';
import { AxiosError } from 'axios';
import { AuthState } from '@/types';
import defaultState from './state';

const mutations: MutationTree<AuthState> = {
  request(state) {
    state.status = 'loading';
  },

  login(state, accessToken) {
    state.status = 'success';
    state.error = null;
    state.accessToken = accessToken;
    state.mfa = null;
  },

  mfa(state, mfa) {
    state.status = 'success';
    state.error = null;
    state.mfa = { ...mfa };
  },

  refresh(state, accessToken) {
    state.status = 'success';
    state.error = null;
    state.accessToken = accessToken;
  },

  logout(state) {
    Object.assign(state, defaultState());
  },

  error(state, error: AxiosError) {
    state.error = error;
    state.status = 'error';
  },
};

export default mutations;
