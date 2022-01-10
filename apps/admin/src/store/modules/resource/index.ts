import { Module } from 'vuex';
import type { ListState, RootState } from '@intake24/admin/types';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const resource: Module<ListState, RootState> = {
  namespaced: true,
  state: state(),
  actions,
  getters,
  mutations,
};

export default resource;
