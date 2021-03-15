import { GetterTree } from 'vuex';
import { ListState, RootState } from '@/types/vuex';

const getters: GetterTree<ListState, RootState> = {
  name: (state) => state.name,
  data: (state) => state.data,
  refs: (state) => state.refs,
  filter: (state) => {
    const { name } = state;
    return (name && state.filter[name]) ?? {};
  },
};

export default getters;
