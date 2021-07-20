import { GetterTree } from 'vuex';
import { EntryState, RootState } from '@/types';

const getters: GetterTree<EntryState, RootState> = {
  data: (state) => state.data,
  dataLoaded: (state) => !!Object.keys(state.data).length,
  refs: (state) => state.refs,
  refsLoaded: (state) => !!Object.keys(state.refs).length,
  addons: (state) => state.addons,
  addonsLoaded: (state) => !!Object.keys(state.addons).length,
};

export default getters;
