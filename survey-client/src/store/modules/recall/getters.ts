import { GetterTree } from 'vuex';
import { RootState, RecallState } from '@/types/vuex';

const getters: GetterTree<RecallState, RootState> = {
  loaded: (state) => !!state.survey,
  survey: (state) => state.survey,
  user: (state) => state.user,
};

export default getters;
