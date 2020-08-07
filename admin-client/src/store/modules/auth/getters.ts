import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';

const getters: GetterTree<AuthState, RootState> = {
  accessToken: (state) => state.accessToken,
  loggedIn: (state) => !!state.accessToken,
  mfaChallenge: (state) => state.mfa,
};

export default getters;
