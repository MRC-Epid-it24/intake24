import { Module } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: state(),
  getters,
  actions,
  mutations,
};

export default auth;
