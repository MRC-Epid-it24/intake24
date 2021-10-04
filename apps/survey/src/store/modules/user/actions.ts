import { ActionTree } from 'vuex';
import { RootState, UserState } from '@/types/vuex';
import tokenSvc from '@/services/token.service';

const actions: ActionTree<UserState, RootState> = {
  async load({ commit }, { accessToken }) {
    const decoded = tokenSvc.decodeAccessToken(accessToken);
    // TODO: initiate logout...?
    if (!decoded) return;

    commit('success', decoded);
  },
};

export default actions;
