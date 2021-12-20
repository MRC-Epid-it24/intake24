import Vue from 'vue';
import { ListState } from '@/types';

export const FILTER_LS_KEY = 'filter';

const state = (): ListState => ({
  name: 'dashboard',
  api: 'admin/dashboard',
  data: [],
  refs: {},
  filter: Vue.ls.get(FILTER_LS_KEY, {}),
  status: '',
  error: null,
});

export default state;
