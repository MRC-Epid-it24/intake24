import { Module } from 'vuex';
import { EntryState, RootState } from '@/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const entry = (name: string): Module<EntryState, RootState> => ({
  namespaced: true,
  state: state(name),
  actions,
  getters,
  mutations,
});

export default entry;
