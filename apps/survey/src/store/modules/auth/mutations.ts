import { MutationTree } from 'vuex';
import { HttpError, HttpResponseData } from '@/types/http';
import { AuthState } from '@/types/vuex';
import defaultState from './state';

const mutations: MutationTree<AuthState> = {
  request(state) {
    state.status = 'loading';
  },
  login(state, accessToken) {
    state.status = 'success';
    state.error = {};
    state.accessToken = accessToken;
  },
  refresh(state, accessToken) {
    state.status = 'success';
    state.error = {};
    state.accessToken = accessToken;
  },
  logout(state) {
    Object.assign(state, defaultState());
  },
  error(state, err: HttpError) {
    const {
      response: { status, statusText, data: { message, errors } = {} as HttpResponseData } = {},
    } = err;
    state.error = {
      errors,
      message,
      status,
      statusText,
    };
    state.status = 'error';
  },
};

export default mutations;
