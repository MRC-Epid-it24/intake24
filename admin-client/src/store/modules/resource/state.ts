import Vue from 'vue';
import { ListState } from '@/types/vuex';

export const FILTER_LS_KEY = 'filter';

const state = (): ListState => ({
  name: 'dashboard',
  data: [],
  refs: {},
  filter: Vue.ls.get(FILTER_LS_KEY, {}),
  status: '',
  error: {},
});

export default state;
