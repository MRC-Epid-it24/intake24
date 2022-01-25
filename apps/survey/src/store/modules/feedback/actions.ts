import axios from 'axios';
import { ActionTree } from 'vuex';
import { RootState, FeedbackState } from '@intake24/survey/types/vuex';

const actions: ActionTree<FeedbackState, RootState> = {
  async setError({ commit }, err: unknown) {
    if (axios.isAxiosError(err)) commit('setError', err);
    else console.error(err);
  },
};

export default actions;
