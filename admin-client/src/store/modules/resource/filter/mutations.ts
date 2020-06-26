import { MutationTree } from 'vuex';
import { FilterState } from '@/types/vuex';

const mutations: MutationTree<FilterState> = {
  set: (state, filter) => {
    state.data = { ...filter };
  },
  add: (state, filter) => {
    state.data = { ...state.data, ...filter };
  },
  reset: (state) => {
    state.data = {};
  },
};

export default mutations;
