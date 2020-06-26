import { ActionTree } from 'vuex';
import { RootState, UserState } from '@/types/vuex';
import tokenSvc from '@/services/token.service';

const actions: ActionTree<UserState, RootState> = {
  async load({ commit }) {
    const decoded = tokenSvc.decodeAccessToken();
    if (!decoded) {
      tokenSvc.clearTokens();
      return;
    }

    commit('success', decoded);
  },
};

export default actions;
