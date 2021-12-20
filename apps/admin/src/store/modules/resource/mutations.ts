import { MutationTree } from 'vuex';
import { AxiosError } from 'axios';
import { ListState } from '@/types';

const mutations: MutationTree<ListState> = {
  update(state, { name, api }) {
    state.name = name;
    state.api = api;
  },

  request(state) {
    state.status = 'loading';
  },

  success(state, res) {
    state.status = 'success';
    state.refs = res.data;
  },

  error(state, error: AxiosError) {
    state.error = error;
    state.status = 'error';
  },

  setFilter: (state, filter) => {
    state.filter = {
      ...state.filter,
      [state.name]: filter,
    };
  },

  resetFilter: (state) => {
    const { [state.name]: remove, ...rest } = state.filter;

    state.filter = { ...rest };
  },
};

export default mutations;
