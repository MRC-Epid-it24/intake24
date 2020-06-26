import { MutationTree } from 'vuex';
import { HttpError, HttpResponseData } from '@/types/http';
import { ListState } from '@/types/vuex';

const mutations: MutationTree<ListState> = {
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
};

export default mutations;
