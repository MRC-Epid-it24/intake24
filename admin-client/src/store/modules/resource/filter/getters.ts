import { GetterTree } from 'vuex';
import { FilterState, RootState } from '@/types/vuex';

const getters: GetterTree<FilterState, RootState> = {
  lsKey: (state) => state.key,
};

export default getters;
