import { MutationTree } from 'vuex';
import { UserState } from '@/types';
import defaultState from './state';

const mutations: MutationTree<UserState> = {
  request(state) {
    state.status = 'loading';
  },
  success(state, data) {
    Object.assign(state, data, { status: 'success' });
  },
  error(state) {
    Object.assign(state, defaultState(), { status: 'error' });
  },
  reset(state) {
    Object.assign(state, defaultState());
  },
};

export default mutations;
