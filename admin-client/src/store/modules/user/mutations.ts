import { MutationTree } from 'vuex';
import { UserState } from '@/types/vuex';
import defaultState from './state';

const mutations: MutationTree<UserState> = {
  request(state) {
    state.status = 'loading';
  },
  success(state, data) {
    Object.assign(state, data, { status: 'success' });
  },
  payload(state, data) {
    state.payload = { ...data };
  },
  error(state) {
    Object.assign(state, defaultState(), { status: 'error' });
  },
  reset(state) {
    Object.assign(state, defaultState());
  },
};

export default mutations;
