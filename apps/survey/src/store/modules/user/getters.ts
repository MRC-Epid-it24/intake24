import { GetterTree } from 'vuex';
import { RootState, UserState } from '@intake24/survey/types/vuex';

const getters: GetterTree<UserState, RootState> = {
  loaded: (state) => !!Object.keys(state.profile).length,
  profile: (state) => state.profile,
};

export default getters;
