import { GetterTree } from 'vuex';
import { EntryState, RootState } from '@intake24/admin/types';

const getters: GetterTree<EntryState, RootState> = {
  data: (state) => state.data,
  dataLoaded: (state) => !!Object.keys(state.data).length,
  refs: (state) => state.refs,
  refsLoaded: (state) => !!Object.keys(state.refs).length,
};

export default getters;
