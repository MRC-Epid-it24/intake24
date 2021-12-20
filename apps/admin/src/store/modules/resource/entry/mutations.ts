import { MutationTree } from 'vuex';
import { Dictionary } from '@common/types';
import { AxiosError } from 'axios';
import { EntryState } from '@/types';

const mutations: MutationTree<EntryState> = {
  request(state) {
    state.data = {};
  },

  init(state) {
    state.data = { ...{ id: null } };
  },

  update(state, data?: Dictionary) {
    if (data) state.data = { ...(data ?? { id: null }) };
  },

  requestRefs(state) {
    state.refs = {};
  },

  updateRefs(state, refs?: Dictionary) {
    if (refs) state.refs = { ...refs };
  },

  error(state, error: AxiosError) {
    state.error = error;
  },
};

export default mutations;
