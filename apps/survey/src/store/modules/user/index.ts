import { Module } from 'vuex';
import { RootState, UserState } from '@intake24/survey/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const user: Module<UserState, RootState> = {
  namespaced: true,
  state: state(),
  getters,
  actions,
  mutations,
};

export default user;
