import { MutationTree } from 'vuex';
import { RecallState } from '@/types/vuex';

const mutations: MutationTree<RecallState> = {
  load(state, data) {
    state.survey = data;
  },
};

export default mutations;
