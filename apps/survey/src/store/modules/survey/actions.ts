import axios from 'axios';
import Vue from 'vue';
import { ActionTree } from 'vuex';
import { SurveyState as CurrentSurveyState } from '@intake24/common/types';
import { RootState, SurveyState } from '@intake24/survey/types/vuex';
import surveyService from '@intake24/survey/services/survey.service';
import { surveyInitialState } from '@intake24/survey/dynamic-recall/dynamic-recall';
import { LS_KEY_HISTORY, LS_KEY_STATE, LS_LIFETIME } from './state';

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

  async setState({ commit }, payload: CurrentSurveyState) {
    commit('setState', payload);
  },

  async clearState({ commit, dispatch }) {
    commit('setState', surveyInitialState);
    dispatch('clearLocalStorageState');
  },

  async clearUndo({ commit }) {
    commit('clearUndo');
  },

  async recordSnapshot(
    { commit, dispatch },
    { value, oldValue }: { value: CurrentSurveyState; oldValue: CurrentSurveyState }
  ) {
    commit('recordSnapshot', oldValue);
    dispatch('saveLocalStorageState');
  },

  saveLocalStorageState({ state }) {
    Vue.ls.set(LS_KEY_STATE, state.data, LS_LIFETIME);
    Vue.ls.set(LS_KEY_HISTORY, state.history, LS_LIFETIME);
  },

  clearLocalStorageState() {
    Vue.ls.remove(LS_KEY_STATE);
    Vue.ls.remove(LS_KEY_HISTORY);
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
