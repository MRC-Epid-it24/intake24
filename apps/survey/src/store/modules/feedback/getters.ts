import { GetterTree } from 'vuex';
import { RootState, FeedbackState } from '@intake24/survey/types/vuex';

const getters: GetterTree<FeedbackState, RootState> = {
  error: (state) => state.error,
};

export default getters;
