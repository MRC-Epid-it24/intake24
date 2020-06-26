import { GetterTree } from 'vuex';
import { EntryState, RootState } from '@/types/vuex';

const getters: GetterTree<EntryState, RootState> = {
  isLoaded: (state) => !!Object.keys(state.data).length,
};

export default getters;
