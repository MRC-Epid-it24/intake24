import { GetterTree } from 'vuex';
import { AuthState, RootState } from '@/types/vuex';

const getters: GetterTree<AuthState, RootState> = {
  // errors: (state) => state.error.errors ?? {},
};

export default getters;
