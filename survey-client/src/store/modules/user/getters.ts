import { GetterTree } from 'vuex';
import { RootState, UserState } from '@/types/vuex';

const getters: GetterTree<UserState, RootState> = {
  loggedIn: (state) => !!Object.keys(state.profile).length,
  profile: (state) => state.profile,
  roles: (state) => state.profile.roles ?? [],
};

export default getters;
