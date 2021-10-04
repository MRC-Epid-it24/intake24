import { MutationTree } from 'vuex';
import { UserState } from '@/types/vuex';
import defaultState from './state';

const mutations: MutationTree<UserState> = {
  success(state, data) {
    state.status = 'success';
    state.profile = { ...state.profile, ...data };
  },
  error(state) {
    Object.assign(state, defaultState(), { status: 'error' });
  },
  reset(state) {
    Object.assign(state, defaultState());
  },
};

export default mutations;
