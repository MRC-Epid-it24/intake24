import { Module } from 'vuex';
import { RootState, RecallState } from '@/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const user: Module<RecallState, RootState> = {
  namespaced: true,
  state: state(),
  getters,
  actions,
  mutations,
};

export default user;
