import { MutationTree } from 'vuex';
import {
  CustomPromptAnswer,
  FoodState,
  MealState,
  MealTime,
  Selection,
  SurveyState as CurrentSurveyState,
} from '@common/types';
import { copy } from '@common/util';
import { SurveyEntryResponse, SurveyUserInfoResponse } from '@common/types/http';
import { SurveyState } from '@/types/vuex';

const mutations: MutationTree<SurveyState> = {
  setParameters(state, data: SurveyEntryResponse) {
    state.parameters = data;
  },

  setUserInfo(state, data: SurveyUserInfoResponse) {
    state.user = data;
  },

  setState(state, data: CurrentSurveyState) {
    state.data = data;
    state.undo = null;
  },

  recordSnapshot(state, data: CurrentSurveyState) {
    state.history.unshift({ timestamp: new Date(), data: copy(data) });
  },

  submitRecall(state) {
    state.data.endTime = new Date();
  },

  setSelection(state, selection: Selection) {
    state.data.selection = selection;
  },

  setCustomPromptAnswer(state, data: { promptId: string; answer: CustomPromptAnswer }) {
    state.data.customPromptAnswers = {
      ...state.data.customPromptAnswers,
      [data.promptId]: data.answer,
    };
  },

  setSurveyFlag(state, data: string) {
    if (state.data.flags.includes(data)) return;

    state.data.flags.push(data);
  },

  setMealTime(state, data: { mealIndex: number; time: MealTime }) {
    // Roundabout way of changing a property of object in an array so Vue can track
    // changes
    const item = state.data.meals.splice(data.mealIndex, 1);
    item[0].time = data.time;
    state.data.meals.splice(data.mealIndex, 0, item[0]);
  },

  deleteMeal(state, mealIndex: number) {
    const mealUndo: MealState[] = state.data.meals.splice(mealIndex, 1);
    if (mealUndo.length !== 0) {
      state.undo = { type: 'meal', index: mealIndex, value: mealUndo[0] };
    }
    const selectedElement = state.data.selection.element;

    if (selectedElement === null) return;

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
  },

  undoDeleteMeal(state, data: { mealIndex: number; meal: MealState }) {
    state.data.meals.splice(data.mealIndex, 0, data.meal);
  },

  clearUndo(state) {
    state.undo = null;
  },

  addMeal(state, mealName: string) {
    const newMeal: MealState = {
      name: mealName,
      defaultTime: { hours: 0, minutes: 0 },
      time: undefined,
      flags: [],
      foods: [],
      customPromptAnswers: {},
    };
    state.data.meals.push(newMeal);
  },

  setMealFlag(state, data: { mealIndex: number; flag: string }) {
    if (state.data.meals[data.mealIndex].flags.includes(data.flag)) return;

    state.data.meals[data.mealIndex].flags.push(data.flag);
  },

  setMealCustomPromptAnswer(
    state,
    data: { mealIndex: number; promptId: string; answer: CustomPromptAnswer }
  ) {
    state.data.meals[data.mealIndex].customPromptAnswers = {
      ...state.data.meals[data.mealIndex].customPromptAnswers,
      [data.promptId]: data.answer,
    };
  },

  setFoodCustomPromptAnswer(
    state,
    data: { mealIndex: number; foodIndex: number; promptId: string; answer: CustomPromptAnswer }
  ) {
    state.data.meals[data.mealIndex].foods[data.foodIndex].customPromptAnswers[data.promptId] =
      data.answer;
  },

  setFoodFlag(state, data: { mealIndex: number; foodIndex: number; flag: string }) {
    if (state.data.meals[data.mealIndex].foods[data.foodIndex].flags.includes(data.flag)) return;

    state.data.meals[data.mealIndex].foods[data.foodIndex].flags.push(data.flag);
  },

  replaceFood(state, data: { mealIndex: number; foodIndex: number; food: FoodState }) {
    state.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1, data.food);
  },

  deleteFood(state, data: { mealIndex: number; foodIndex: number }) {
    const foodUndo: FoodState[] = state.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1);
    if (foodUndo.length !== 0) {
      state.undo = {
        type: 'food',
        index: data.foodIndex,
        mealIndex: data.mealIndex,
        value: foodUndo[0],
      };
    }
  },

  updateFood(
    state,
    data: { mealIndex: number; foodIndex: number; update: (state: FoodState) => void }
  ) {
    const foodState = state.data.meals[data.mealIndex].foods[data.foodIndex];
    data.update(foodState);

    const spliced = state.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1)[0];
    state.data.meals[data.mealIndex].foods.splice(data.foodIndex, 0, spliced);
  },

  addFood(state, data: { mealIndex: number; food: FoodState }) {
    state.data.meals[data.mealIndex].foods.push(data.food);
  },

  setFoods(state, data: { mealIndex: number; foods: FoodState[] }) {
    state.data.meals[data.mealIndex].foods = data.foods;
  },
};

export default mutations;
