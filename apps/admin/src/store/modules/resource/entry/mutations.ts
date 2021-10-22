import { MutationTree } from 'vuex';
import { Dictionary } from '@common/types';
import { AxiosError } from 'axios';
import { EntryState } from '@/types';

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

  error(state, error: AxiosError) {
    state.error = error;
    state.status = 'error';
  },

  update(state, { data, refs, addons }: Partial<Record<'data' | 'refs' | 'addons', Dictionary>>) {
    if (data) state.data = { ...data };
    if (refs) state.refs = { ...refs };
    if (addons) state.addons = { ...addons };
  },
};

export default mutations;
