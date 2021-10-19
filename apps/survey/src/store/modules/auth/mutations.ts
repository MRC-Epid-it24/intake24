import { MutationTree } from 'vuex';
import { AxiosError } from 'axios';
import { AuthState } from '@/types/vuex';
import defaultState from './state';

const mutations: MutationTree<AuthState> = {
  request(state) {
    state.status = 'loading';
  },
  login(state, accessToken: string) {
    state.status = 'success';
    state.error = null;
    state.accessToken = accessToken;
  },
  refresh(state, accessToken: string) {
    state.status = 'success';
    state.error = null;
    state.accessToken = accessToken;
  },
  logout(state) {
    Object.assign(state, defaultState());
  },
  error(state, err: AxiosError) {
    state.error = err;
    state.status = 'error';
  },
};

export default mutations;
