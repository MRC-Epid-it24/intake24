import Vue from 'vue';
import { ActionTree } from 'vuex';
import { RootState, SurveyState } from '@/types/vuex';
import { SurveyState as CurrentSurveyState } from '@common/types';
import surveyService from '@/services/survey.service';
import { STATE_LS_KEY } from './state';

const actions: ActionTree<SurveyState, RootState> = {
  async loadParameters({ commit }, { surveyId }: { surveyId: string }) {
    try {
      const surveyInfo = await surveyService.surveyInfo(surveyId);
      commit('setParameters', surveyInfo);
    } catch (err) {
      // continue;
    }
  },

  async setState({ commit, state }, payload: CurrentSurveyState) {
    commit('setState', payload);
    Vue.ls.set(STATE_LS_KEY, state.data, 24 * 60 * 60 * 1000);
  },

  async clearState({ commit }) {
    commit('setState', null);
    Vue.ls.remove(STATE_LS_KEY);
  },
};

export default actions;
