import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';

const getters: GetterTree<AuthState, RootState> = {
  accessToken: (state) => state.accessToken,
  loggedIn: (state) => !!state.accessToken,
};

export default getters;
