import Vue from 'vue';
import { SurveyState } from '@/types/vuex';

export const STATE_LS_KEY = 'state';

const state = (): SurveyState => ({
  parameters: null,
  user: null,
  data: Vue.ls.get(STATE_LS_KEY, null),
});

export default state;
