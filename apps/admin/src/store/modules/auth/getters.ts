import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@intake24/admin/types';

const getters: GetterTree<AuthState, RootState> = {
  accessToken: (state) => state.accessToken,
  loggedIn: (state) => !!state.accessToken,
  mfaRequestUrl: (state) => state.mfaRequestUrl,
};

export default getters;
