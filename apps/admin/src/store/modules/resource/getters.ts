import { GetterTree } from 'vuex';
import { ListState, RootState } from '@intake24/admin/types';

const getters: GetterTree<ListState, RootState> = {
  name: (state) => state.name,
  api: (state) => state.api,
  data: (state) => state.data,
  refs: (state) => state.refs,
  filter: (state) => {
    const { name } = state;
    return (name && state.filter[name]) ?? {};
  },
};

export default getters;
