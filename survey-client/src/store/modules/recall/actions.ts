import Vue from 'vue';
import { ActionTree } from 'vuex';
import { RootState, RecallState } from '@/types/vuex';
import { RecallState as CurrentRecallState } from '@common/types';
import surveyService from '@/services/survey.service';
import { STATE_LS_KEY } from './state';

const actions: ActionTree<RecallState, RootState> = {
  async load({ commit }, { surveyId }: { surveyId: string }) {
    try {
      const surveyInfo = await surveyService.surveyInfo(surveyId);
      commit('load', surveyInfo);
    } catch (err) {
      // continue;
    }
  },

  async setState({ commit, state }, payload: CurrentRecallState) {
    commit('state', payload);
    Vue.ls.set(STATE_LS_KEY, state.state, 24 * 60 * 60 * 1000);
  },

  async clearState({ commit }) {
    commit('state', null);
    Vue.ls.remove(STATE_LS_KEY);
  },
};

export default actions;
