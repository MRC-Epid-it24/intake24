import { ActionTree } from 'vuex';
import { RootState, UserState } from '@intake24/survey/types/vuex';
import tokenSvc from '@intake24/survey/services/token.service';

const actions: ActionTree<UserState, RootState> = {
  async load({ commit }, { accessToken }) {
    const decoded = tokenSvc.decodeAccessToken(accessToken);
    // TODO: initiate logout...?
    if (!decoded) return;

    commit('success', decoded);
  },
};

export default actions;
