import { GetterTree } from 'vuex';
import { RootState, SurveyState } from '@/types/vuex';

const getters: GetterTree<SurveyState, RootState> = {
  parametersLoaded: (state) => !!state.parameters,
};

export default getters;
