import Vue from 'vue';
import { RecallState } from '@/types/vuex';

export const STATE_LS_KEY = 'state';

const state = (): RecallState => ({
  survey: null,
  user: null,
  state: Vue.ls.get(STATE_LS_KEY, null),
});

export default state;
