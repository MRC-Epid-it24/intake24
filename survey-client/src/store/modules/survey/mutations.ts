import { MutationTree } from 'vuex';
import { SurveyState } from '@/types/vuex';
import { CustomPromptAnswer, MealTime, SurveyState as CurrentSurveyState } from '@common/types';
import { SurveyEntryResponse } from '@common/types/http';

const mutations: MutationTree<SurveyState> = {
  setParameters(state, data: SurveyEntryResponse) {
    state.parameters = data;
  },

  setState(state, data: CurrentSurveyState) {
    state.data = data;
  },

  setCustomPromptAnswer(state: SurveyState, data: { promptId: string; answer: CustomPromptAnswer }) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.customPromptAnswers[data.promptId] = data.answer;
    }
  },

  setMealTime(state: SurveyState, data: { mealIndex: number, time: MealTime }) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.meals[data.mealIndex].time = data.time;
    }
  },

  setSurveyFlag(state: SurveyState, data: string) {
    if (state.data == null) {
      console.error('state.data is null');
    } else if (!state.data.flags.includes(data)) state.data.flags.push(data);
  },
};

export default mutations;
