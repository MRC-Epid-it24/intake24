import { MutationTree } from 'vuex';
import { HttpError, HttpResponseData } from '@/types/http';
import { ListState } from '@/types/vuex';

const mutations: MutationTree<ListState> = {
  update(state, resource) {
    state.name = resource;
  },

  request(state) {
    state.status = 'loading';
  },

  success(state, res) {
    state.status = 'success';
    state.refs = res.data;
  },

  error(state, err: HttpError) {
    const {
      response: { status, statusText, data: { message } = {} as HttpResponseData } = {},
    } = err;
    state.error = {
      message,
      status,
      statusText,
    };
    state.status = 'error';
  },

  setFilter: (state, filter) => {
    state.filter = {
      ...state.filter,
      [state.name]: filter,
    };
  },

  resetFilter: (state) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [state.name]: remove, ...rest } = state.filter;

    state.filter = { ...rest };
  },
};

export default mutations;
