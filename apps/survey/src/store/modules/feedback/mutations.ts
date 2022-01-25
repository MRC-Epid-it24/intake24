import { MutationTree } from 'vuex';
import { AxiosError } from 'axios';
import { FeedbackState } from '@intake24/survey/types/vuex';

const mutations: MutationTree<FeedbackState> = {
  setError(state, error: AxiosError) {
    state.error = error;
  },
};

export default mutations;
