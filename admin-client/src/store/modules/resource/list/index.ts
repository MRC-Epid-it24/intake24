import { Module } from 'vuex';
import { ListState, RootState } from '@/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const list = (name: string): Module<ListState, RootState> => ({
  namespaced: true,
  state: state(name),
  actions,
  getters,
  mutations,
});

export default list;
