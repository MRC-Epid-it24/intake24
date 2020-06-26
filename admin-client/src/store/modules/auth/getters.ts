import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';

const getters: GetterTree<AuthState, RootState> = {
  mfaChallenge: (state) => state.mfa,
};

export default getters;
