import { Module } from 'vuex';
import { EntryState, RootState } from '@/types';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const entry: Module<EntryState, RootState> = {
  namespaced: true,
  state: state(),
  actions,
  getters,
  mutations,
};

export default entry;
