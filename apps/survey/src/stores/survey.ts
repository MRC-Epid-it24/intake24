import Vue from 'vue';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import {
  FoodState,
  MealState,
  CustomPromptAnswer,
  MealTime,
  Selection,
  SurveyState as CurrentSurveyState,
  EncodedFood,
  FreeTextFood,
} from '@intake24/common/types';
import { SurveyEntryResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import { surveyInitialState } from '@intake24/survey/dynamic-recall/dynamic-recall';
import { copy } from '@intake24/common/util';
import { useLoading } from './loading';
import { surveyService } from '../services';

export type MealUndo = {
  type: 'meal';
  index: number;
  value: MealState;
};

export type FoodUndo = {
  type: 'food';
  index: number;
  mealIndex: number;
  value: FoodState;
};

export type SurveyStateSnapshot = {
  timestamp: Date;
  data: CurrentSurveyState;
};

export interface SurveyState {
  parameters: SurveyEntryResponse | null;
  user: SurveyUserInfoResponse | null;
  data: CurrentSurveyState;
  history: SurveyStateSnapshot[];
  undo: MealUndo | FoodUndo | null;
  error: AxiosError | null;
}

export const LS_KEY_STATE = 'state';
export const LS_KEY_HISTORY = 'history';
export const LS_LIFETIME = 12 * 60 * 60 * 1000;

export const useSurvey = defineStore('survey', {
  state: (): SurveyState => ({
    parameters: null,
    user: null,
    data: Vue.ls.get(LS_KEY_STATE, surveyInitialState),
    history: Vue.ls.get(LS_KEY_HISTORY, []),
    undo: null,
    error: null,
  }),
  getters: {
    parametersLoaded: (state) => !!state.parameters && !!state.user,
    currentState: (state) => state.data,
    hasStarted: (state) => !!state.data.startTime,
    hasFinished: (state) => !!state.data.endTime,
    meals: (state) => state.data.meals,
    defaultSchemeMeals: (state) => state.parameters?.surveyScheme.meals,
    selection: (state) => state.data.selection,
    selectedMealIndex: (state) => state.data.selection.element?.mealIndex,
    selectedMeal: (state) => {
      const mealIndex = state.data.selection.element?.mealIndex;
      const { meals } = state.data;

      if (mealIndex === undefined) return undefined;
      return meals[mealIndex];
    },
    undoEntity: (state) => state.undo,
    selectedFood: (state) => {
      const { element } = state.data.selection;

      if (element === null || element.type !== 'food') return undefined;

      return state.data.meals[element.mealIndex].foods[element.foodIndex];
    },
    selectedFoodIndex: (state) => {
      const { element } = state.data.selection;

      if (element === null || element.type !== 'food') return undefined;

      return element.foodIndex;
    },
  },
  actions: {
    async loadParameters(surveyId: string) {
      const loading = useLoading();
      loading.addItem('loadParameters');

      try {
        const [surveyInfo, userInfo] = await Promise.all([
          surveyService.surveyInfo(surveyId),
          surveyService.userInfo(surveyId),
        ]);
        this.parameters = surveyInfo;
        this.user = userInfo;
      } catch (err) {
        if (axios.isAxiosError(err)) this.error = err;
        else console.error(err);
      } finally {
        loading.removeItem('loadParameters');
      }
    },

    async setState(payload: CurrentSurveyState) {
      this.data = payload;
      this.undo = null;
    },

    async clearState() {
      this.setState(surveyInitialState);
      this.clearLocalStorageState();
    },

    async clearUndo() {
      this.undo = null;
    },

    async recordSnapshot({
      value,
      oldValue,
    }: {
      value: CurrentSurveyState;
      oldValue: CurrentSurveyState;
    }) {
      this.history.unshift({ timestamp: new Date(), data: copy(oldValue) });
      this.saveLocalStorageState();
    },

    saveLocalStorageState() {
      Vue.ls.set(LS_KEY_STATE, this.data, LS_LIFETIME);
      Vue.ls.set(LS_KEY_HISTORY, this.history, LS_LIFETIME);
    },

    clearLocalStorageState() {
      Vue.ls.remove(LS_KEY_STATE);
      Vue.ls.remove(LS_KEY_HISTORY);
    },

    async submitRecall() {
      this.data.endTime = new Date();
      const surveyId = this.parameters?.id;

      if (!surveyId) {
        console.error(`Survey parameters not loaded. Cannot submit the survey.`);
        return;
      }

      await surveyService.submit(surveyId, this.data);
      // TODO: do the submitted state cleanup and user has landed on final page and doesn't need that anymore
    },

    setParameters(data: SurveyEntryResponse) {
      this.parameters = data;
    },

    setUserInfo(data: SurveyUserInfoResponse) {
      this.user = data;
    },

    setSelection(selection: Selection) {
      this.data.selection = selection;
    },

    setCustomPromptAnswer(data: { promptId: string; answer: CustomPromptAnswer }) {
      this.data.customPromptAnswers = {
        ...this.data.customPromptAnswers,
        [data.promptId]: data.answer,
      };
    },

    setSurveyFlag(data: string) {
      if (this.data.flags.includes(data)) return;

      this.data.flags.push(data);
    },

    setMealTime(data: { mealIndex: number; time: MealTime }) {
      // Roundabout way of changing a property of object in an array so Vue can track
      // changes
      const item = this.data.meals.splice(data.mealIndex, 1);
      item[0].time = data.time;
      this.data.meals.splice(data.mealIndex, 0, item[0]);
    },

    deleteMeal(mealIndex: number) {
      const mealUndo: MealState[] = this.data.meals.splice(mealIndex, 1);
      if (mealUndo.length !== 0) {
        this.undo = { type: 'meal', index: mealIndex, value: mealUndo[0] };
      }
      const selectedElement = this.data.selection.element;

      if (selectedElement === null) return;

      const selectedMealIndex = selectedElement.mealIndex;

      if (selectedMealIndex < mealIndex) return;

      if (selectedMealIndex > mealIndex) {
        selectedElement.mealIndex -= 1;
        return;
      }

      this.data.selection.mode = 'auto';
      selectedElement.type = 'meal'; // if a food from the deleted meal was selected make sure new selection is a meal

      if (selectedElement.mealIndex === this.data.meals.length) selectedElement.mealIndex -= 1;

      if (selectedElement.mealIndex < 0) this.data.selection.element = null;
    },

    undoDeleteMeal(data: { mealIndex: number; meal: MealState }) {
      this.data.meals.splice(data.mealIndex, 0, data.meal);
    },

    addMeal(mealName: string, locale: string) {
      const newMeal: MealState = {
        name: mealName,
        localName: { en: mealName },
        defaultTime: { hours: 0, minutes: 0 },
        time: undefined,
        flags: [],
        foods: [],
        customPromptAnswers: {},
      };
      newMeal.localName[locale] = mealName;
      this.data.meals.push(newMeal);
    },

    setMealFlag(data: { mealIndex: number; flag: string }) {
      if (this.data.meals[data.mealIndex].flags.includes(data.flag)) return;

      this.data.meals[data.mealIndex].flags.push(data.flag);
    },

    setMealCustomPromptAnswer(data: {
      mealIndex: number;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      this.data.meals[data.mealIndex].customPromptAnswers = {
        ...this.data.meals[data.mealIndex].customPromptAnswers,
        [data.promptId]: data.answer,
      };
    },

    setFoodCustomPromptAnswer(data: {
      mealIndex: number;
      foodIndex: number;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      this.data.meals[data.mealIndex].foods[data.foodIndex].customPromptAnswers[data.promptId] =
        data.answer;
    },

    setFoodFlag(data: { mealIndex: number; foodIndex: number; flag: string }) {
      if (this.data.meals[data.mealIndex].foods[data.foodIndex].flags.includes(data.flag)) return;

      this.data.meals[data.mealIndex].foods[data.foodIndex].flags.push(data.flag);
    },

    replaceFood(data: { mealIndex: number; foodIndex: number; food: FoodState }) {
      this.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1, data.food);
    },

    deleteFood(data: { mealIndex: number; foodIndex: number }) {
      const foodUndo: FoodState[] = this.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1);
      if (foodUndo.length !== 0) {
        this.undo = {
          type: 'food',
          index: data.foodIndex,
          mealIndex: data.mealIndex,
          value: foodUndo[0],
        };
      }
    },

    updateFoodCallback(data: {
      mealIndex: number;
      foodIndex: number;
      update: (state: FoodState) => void;
    }) {
      const foodState = this.data.meals[data.mealIndex].foods[data.foodIndex];
      data.update(foodState);

      const spliced = this.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1)[0];
      this.data.meals[data.mealIndex].foods.splice(data.foodIndex, 0, spliced);
    },

    updateFood(data: {
      mealIndex: number;
      foodIndex: number;
      food: Partial<Omit<FreeTextFood, 'type'>> | Partial<Omit<EncodedFood, 'type'>>;
    }) {
      const { mealIndex, foodIndex, food } = data;

      const foodState = this.data.meals[mealIndex].foods[foodIndex];
      this.data.meals[mealIndex].foods.splice(foodIndex, 1, { ...foodState, ...food });
    },

    addFood(data: { mealIndex: number; food: FoodState }) {
      this.data.meals[data.mealIndex].foods.push(data.food);
    },

    setFoods(data: { mealIndex: number; foods: FoodState[] }) {
      this.data.meals[data.mealIndex].foods = data.foods;
    },
  },
});

export type SurveyStore = ReturnType<typeof useSurvey>;
