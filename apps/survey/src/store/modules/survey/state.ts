import Vue from 'vue';
import { SurveyState } from '@intake24/survey/types/vuex';
import { surveyInitialState } from '@intake24/survey/dynamic-recall/dynamic-recall';

export const LS_KEY_STATE = 'state';
export const LS_KEY_HISTORY = 'history';
export const LS_LIFETIME = 12 * 60 * 60 * 1000;

const state = (): SurveyState => ({
  parameters: null,
  user: null,
  data: Vue.ls.get(LS_KEY_STATE, surveyInitialState),
  history: Vue.ls.get(LS_KEY_HISTORY, []),
  undo: null,
  error: null,
});

export default state;
