import { MutationTree } from 'vuex';
import { AxiosError } from 'axios';
import { AuthState } from '@intake24/admin/types';
import defaultState from './state';

const mutations: MutationTree<AuthState> = {
  login(state, accessToken) {
    state.error = null;

    state.accessToken = accessToken;
    state.mfaRequestUrl = null;
  },

  mfaRequest(state, url) {
    state.error = null;

    state.accessToken = null;
    state.mfaRequestUrl = url;
  },

  refresh(state, accessToken) {
    state.error = null;

    state.accessToken = accessToken;
  },

  logout(state) {
    Object.assign(state, defaultState());
  },

  error(state, error: AxiosError) {
    state.error = error;
  },
};

export default mutations;
