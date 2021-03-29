import { MutationTree } from 'vuex';
import { RecallState } from '@/types/vuex';
import { RecallState as CurrentRecallState } from '@common/types';
import { SurveyEntryResponse } from '@common/types/http';

const mutations: MutationTree<RecallState> = {
  load(state, data: SurveyEntryResponse) {
    state.survey = data;
  },

  state(state, data: CurrentRecallState) {
    state.state = data;
  },
};

export default mutations;
