import { ActionTree } from 'vuex';
import { RootState, RecallState } from '@/types/vuex';
import surveyService from '@/services/survey.service';

const actions: ActionTree<RecallState, RootState> = {
  async load({ commit }, { surveyId }: { surveyId: string }) {
    try {
      const surveyInfo = await surveyService.surveyInfo(surveyId);
      commit('load', surveyInfo);
    } catch (err) {
      // continue;
    }
  },
};

export default actions;
