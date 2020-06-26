import { Module } from 'vuex';
import { FilterState, RootState } from '@/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const filter = (name: string): Module<FilterState, RootState> => ({
  namespaced: true,
  state: state(name),
  actions,
  getters,
  mutations,
});

export default filter;
