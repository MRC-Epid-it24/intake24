import axios from 'axios';
import Vue from 'vue';
import { ActionTree } from 'vuex';
import { SurveyState as CurrentSurveyState } from '@common/types';
import { RootState, SurveyState } from '@/types/vuex';
import surveyService from '@/services/survey.service';
import { HISTORY_LS_KEY, STATE_LS_KEY } from './state';

const actions: ActionTree<SurveyState, RootState> = {
  async loadParameters({ commit }, { surveyId }: { surveyId: string }) {
    commit('loading/add', 'loadParameters', { root: true });

    try {
      const [surveyInfo, userInfo] = await Promise.all([
        surveyService.surveyInfo(surveyId),
        surveyService.userInfo(surveyId),
      ]);
      commit('setParameters', surveyInfo);
      commit('setUserInfo', userInfo);
    } catch (err) {
      if (axios.isAxiosError(err)) commit('setError', err);
      else console.error(err);
    } finally {
      commit('loading/remove', 'loadParameters', { root: true });
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

  async clearUndo({ commit }) {
    commit('clearUndo');
  },

  async recordSnapshot(
    { commit, state },
    { value, oldValue }: { value: CurrentSurveyState; oldValue: CurrentSurveyState }
  ) {
    commit('recordSnapshot', oldValue);
    Vue.ls.set(HISTORY_LS_KEY, state.history, 24 * 60 * 60 * 1000);
  },

  async submitRecall({ commit, state }) {
    commit('submitRecall');

    const surveyId = state.parameters?.id;
    if (!surveyId) {
      console.error(`Survey parameters not loaded. Cannot submit the survey.`);
      return;
    }

    await surveyService.submit(surveyId, state.data);
    // TODO: do the submitted state cleanup and user has landed on final page and doesn't need that anymore
  },
};

export default actions;
