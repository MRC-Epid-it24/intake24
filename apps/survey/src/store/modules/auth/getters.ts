import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@intake24/survey/types/vuex';

const getters: GetterTree<AuthState, RootState> = {
  accessToken: (state) => state.accessToken,
  loggedIn: (state) => !!state.accessToken,
};

export default getters;
