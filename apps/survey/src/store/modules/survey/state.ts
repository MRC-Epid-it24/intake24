import Vue from 'vue';
import { SurveyState } from '@/types/vuex';
import { surveyInitialState } from '@/dynamic-recall/dynamic-recall';

export const STATE_LS_KEY = 'state';
export const HISTORY_LS_KEY = 'history';

const state = (): SurveyState => ({
  parameters: null,
  user: null,
  data: Vue.ls?.get(STATE_LS_KEY, surveyInitialState),
  history: [],
  undo: null,
  error: null,
});

export default state;
