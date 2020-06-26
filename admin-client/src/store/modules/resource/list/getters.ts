import { GetterTree } from 'vuex';
import { ListState, RootState } from '@/types/vuex';

const getters: GetterTree<ListState, RootState> = {
  // isLoaded: (state) => !!Object.keys(state.refs).length,
};

export default getters;
