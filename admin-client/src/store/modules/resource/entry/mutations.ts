import { MutationTree } from 'vuex';
import { HttpError, HttpResponseData } from '@/types/http';
import { EntryState } from '@/types/vuex';

const mutations: MutationTree<EntryState> = {
  request(state) {
    state.data = {};
    state.refs = {};
    state.addons = {};
    state.status = 'loading';
  },
  success(state, res) {
    state.status = 'success';
    const { data = { id: null }, refs = {}, ...addons } = res.data;
    state.data = { ...data };
    state.refs = { ...refs };
    state.addons = { ...addons };
  },
  error(state, err: HttpError) {
    const { response: { status, statusText, data: { message } = {} as HttpResponseData } = {} } =
      err;
    state.error = {
      message,
      status,
      statusText,
    };
    state.status = 'error';
  },
};

export default mutations;
