import { MutationTree } from 'vuex';
import { SurveyState } from '@/types/vuex';
import {
  CustomPromptAnswer,
  MealState2,
  MealTime,
  Selection2,
  SurveyState as CurrentSurveyState,
} from '@common/types';
import { SurveyEntryResponse, SurveyUserInfoResponse } from '@common/types/http';

const mutations: MutationTree<SurveyState> = {
  setParameters(state, data: SurveyEntryResponse) {
    state.parameters = data;
  },

  setUserInfo(state, data: SurveyUserInfoResponse) {
    state.user = data;
  },

  setState(state, data: CurrentSurveyState) {
    state.data = data;
  },

  setSelection(state, selection: Selection2) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.selection = selection;
    }
  },

  setCustomPromptAnswer(
    state: SurveyState,
    data: { promptId: string; answer: CustomPromptAnswer }
  ) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.customPromptAnswers[data.promptId] = data.answer;
    }
  },

  setSurveyFlag(state: SurveyState, data: string) {
    if (state.data == null) {
      console.error('state.data is null');
    } else if (!state.data.flags.includes(data)) state.data.flags.push(data);
  },

  setMealTime(state: SurveyState, data: { mealIndex: number; time: MealTime }) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      // Roundabout way of changing a property of object in an array so Vue can track
      // changes
      const item = state.data.meals.splice(data.mealIndex, 1);
      item[0].time = data.time;
      state.data.meals.splice(data.mealIndex, 0, item[0]);
    }
  },

  deleteMeal(state: SurveyState, mealIndex: number) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.meals.splice(mealIndex, 1);

      const selectedElement = state.data.selection.element;

      if (selectedElement == null) return;

      const selectedMealIndex = selectedElement.mealIndex;

      if (selectedMealIndex < mealIndex) return;

      if (selectedMealIndex > mealIndex) {
        selectedElement.mealIndex -= 1;
        return;
      }

      state.data.selection.mode = 'auto';
      selectedElement.type = 'meal'; // if a food from the deleted meal was selected make sure new selection is a meal

      if (selectedElement.mealIndex === state.data.meals.length) selectedElement.mealIndex -= 1;

      if (selectedElement.mealIndex < 0) state.data.selection.element = null;
    }
  },

  addMeal(state: SurveyState, mealName: string) {
    if (state.data == null || mealName == null) {
      console.error('state.data is null');
    } else {
      const newMeal: MealState2 = {
        name: mealName,
        defaultTime: { hours: 0, minutes: 0 },
        time: undefined,
        flags: [],
        foods: [],
        customPromptAnswers: {},
      };
      state.data.meals.push(newMeal);
    }
  },

  setMealFlag(state: SurveyState, data: { mealIndex: number; flag: string }) {
    if (state.data == null) {
      console.error('state.data is null');
    } else if (!state.data.meals[data.mealIndex].flags.includes(data.flag))
      state.data.meals[data.mealIndex].flags.push(data.flag);
  },

  setMealCustomPromptAnswer(
    state: SurveyState,
    data: { mealIndex: number; promptId: string; answer: CustomPromptAnswer }
  ) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.meals[data.mealIndex].customPromptAnswers[data.promptId] = data.answer;
    }
  },

  setFoodCustomPromptAnswer(
    state: SurveyState,
    data: { mealIndex: number; foodIndex: number; promptId: string; answer: CustomPromptAnswer }
  ) {
    if (state.data == null) {
      console.error('state.data is null');
    } else {
      state.data.meals[data.mealIndex].foods[data.foodIndex].customPromptAnswers[data.promptId] =
        data.answer;
    }
  },

  setFoodFlag(state: SurveyState, data: { mealIndex: number; foodIndex: number; flag: string }) {
    if (state.data == null) {
      console.error('state.data is null');
    } else if (!state.data.meals[data.mealIndex].foods[data.foodIndex].flags.includes(data.flag))
      state.data.meals[data.mealIndex].foods[data.foodIndex].flags.push(data.flag);
  },
};

export default mutations;
