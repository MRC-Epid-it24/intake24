import type { AxiosError } from 'axios';
import axios from 'axios';
import { defineStore } from 'pinia';
import Vue from 'vue';

import type {
  CustomPromptAnswer,
  EncodedFood,
  FoodState,
  FreeTextFood,
  MealState,
  MealTime,
  PromptAnswer,
  Selection,
  SurveyState as CurrentSurveyState,
} from '@intake24/common/types';
import type { SurveyEntryResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { surveyInitialState } from '@intake24/survey/dynamic-recall/dynamic-recall';
import {
  findFood,
  findMeal,
  getFoodIndex,
  getFoodIndexRequired,
  getMealIndex,
  getMealIndexForSelection,
  getMealIndexRequired,
} from '@intake24/survey/stores/meal-food-utils';
import { recallLog } from '@intake24/survey/stores/recall-log';
import { useLoading } from '@intake24/ui/stores';

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

export interface MealFoodIndex {
  mealIndex: number;
  foodIndex: number;
  linkedFoodIndex: number | undefined;
}

export interface FoodIndex {
  foodIndex: number;
  linkedFoodIndex: number | undefined;
}

export const useSurvey = defineStore('survey', {
  state: (): SurveyState => ({
    parameters: null,
    user: null,
    data: surveyInitialState,
    history: [],
    undo: null,
    error: null,
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}survey`,
    paths: ['data', 'history'],
  },
  getters: {
    parametersLoaded: (state) => !!state.parameters && !!state.user,
    currentState: (state) => state.data,
    hasStarted: (state) => !!state.data.startTime,
    hasFinished: (state) => !!state.data.endTime,
    meals: (state) => state.data.meals,
    hasMeals: (state) => state.data.meals.length,
    defaultSchemeMeals: (state) => state.parameters?.surveyScheme.meals,
    selection: (state) => state.data.selection,
    currentTempPromptAnswer: (state): PromptAnswer | undefined => {
      return state.data.tempPromptAnswer;
    },
    selectedMealOptional: (state) => {
      const { element } = state.data.selection;

      if (element === null || element.type !== 'meal') return undefined;

      const meals = state.data.meals;
      const mealIndex = getMealIndex(meals, element.mealId);

      if (mealIndex === undefined) return undefined;

      return meals[mealIndex];
    },

    undoEntity: (state) => state.undo,
    selectedFoodOptional: (state) => {
      const { element } = state.data.selection;

      if (element === null || element.type !== 'food') return undefined;

      const meals = state.data.meals;

      const foodIndex = getFoodIndex(meals, element.foodId);

      if (foodIndex === undefined) return undefined;

      if (foodIndex.linkedFoodIndex === undefined)
        return meals[foodIndex.mealIndex].foods[foodIndex.foodIndex];
      else
        return meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods[
          foodIndex.linkedFoodIndex
        ];
    },
    continueButtonEnabled: (state) => {
      return state.data.continueButtonEnabled;
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
    },

    async submitRecall() {
      this.data.endTime = new Date();
      const surveyId = this.parameters?.slug;

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
      recallLog().selectionChanged(selection);
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

    setMealTime(data: { mealId: number; time: MealTime }) {
      const mealIndex = getMealIndexRequired(this.data.meals, data.mealId);

      // Roundabout way of changing a property of object in an array so Vue can track
      // changes
      const item = this.data.meals.splice(mealIndex, 1);
      item[0].time = data.time;
      this.data.meals.splice(mealIndex, 0, item[0]);
    },

    deleteMeal(mealId: number) {
      /*
      Undo system needs review & a more general solution

       const mealUndo: MealState[] = this.data.meals.splice(mealIndex, 1);
       if (mealUndo.length !== 0) {
        this.undo = { type: 'meal', index: mealIndex, value: mealUndo[0] };
      }*/

      function getAlternativeMealSelection(meals: MealState[], mealIndex: number): Selection {
        // Try selecting next meal first

        if (mealIndex < meals.length - 1) {
          return {
            mode: 'auto',
            element: {
              type: 'meal',
              mealId: meals[mealIndex + 1].id,
            },
          };
        }

        // Try selecting previous meal otherwise

        if (mealIndex > 0) {
          return {
            mode: 'auto',
            element: {
              type: 'meal',
              mealId: meals[mealIndex - 1].id,
            },
          };
        }

        // If neither exists (i.e. only one food in the list) select nothing

        return {
          mode: 'auto',
          element: null,
        };
      }

      const selectionMealIndex = getMealIndexForSelection(this.data.meals, this.data.selection);

      const mealIndex = getMealIndexRequired(this.data.meals, mealId);

      if (selectionMealIndex === mealIndex) {
        this.data.selection = getAlternativeMealSelection(this.data.meals, mealIndex);
      }

      Vue.delete(this.data.meals, mealIndex);
    },

    undoDeleteMeal(data: { mealIndex: number; meal: MealState }) {
      this.data.meals.splice(data.mealIndex, 0, data.meal);
    },

    addMeal(mealName: string, locale: string) {
      const newMeal: MealState = {
        id: this.getNextMealId(),
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

    setMealFlag(data: { mealId: number; flag: string }) {
      const meal = findMeal(this.data.meals, data.mealId);

      if (meal.flags.includes(data.flag)) return;

      meal.flags.push(data.flag);
    },

    setMealCustomPromptAnswer(data: {
      mealId: number;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      const meal = findMeal(this.data.meals, data.mealId);

      meal.customPromptAnswers = {
        ...meal.customPromptAnswers,
        [data.promptId]: data.answer,
      };
    },

    setFoodCustomPromptAnswer(data: {
      foodId: number;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      const food = findFood(this.data.meals, data.foodId);

      food.customPromptAnswers[data.promptId] = data.answer;
    },

    setFoodFlag(data: { foodId: number; flag: string }) {
      const food = findFood(this.data.meals, data.foodId);

      if (food.flags.includes(data.flag)) return;

      food.flags.push(data.flag);
    },

    replaceFood(data: { foodId: number; food: FoodState }) {
      const foodIndex = getFoodIndexRequired(this.data.meals, data.foodId);

      if (foodIndex.linkedFoodIndex === undefined) {
        this.data.meals[foodIndex.mealIndex].foods.splice(foodIndex.foodIndex, 1, data.food);
      } else {
        this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods.splice(
          foodIndex.linkedFoodIndex,
          1,
          data.food
        );
      }
    },

    updateFood(data: {
      foodId: number;
      update: Partial<Omit<FreeTextFood, 'type'>> | Partial<Omit<EncodedFood, 'type'>>;
    }) {
      const foodState = findFood(this.meals, data.foodId);
      this.replaceFood({ foodId: data.foodId, food: { ...foodState, ...data.update } });
    },

    deleteFood(data: { foodId: number }) {
      /*
      Undo system needs review & a more general solution

      const foodUndo: FoodState[] = this.data.meals[data.mealIndex].foods.splice(data.foodIndex, 1);
      if (foodUndo.length !== 0) {
        this.undo = {
          type: 'food',
          index: data.foodIndex,
          mealIndex: data.mealIndex,
          value: foodUndo[0],
        };
      }*/

      const foodIndex = getFoodIndexRequired(this.data.meals, data.foodId);

      if (foodIndex.linkedFoodIndex === undefined) {
        this.data.meals[foodIndex.mealIndex].foods.splice(foodIndex.foodIndex, 1);
      } else {
        this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods.splice(
          foodIndex.linkedFoodIndex,
          1
        );
      }

      // FIXME: update selection
      this.data.selection = {
        mode: 'auto',
        element: null,
      };
    },

    updateFoodCallback(data: { foodId: number; update: (state: FoodState) => FoodState }) {
      const food = findFood(this.data.meals, data.foodId);
      this.replaceFood({ foodId: data.foodId, food: data.update(food) });
    },

    addFood(data: { mealId: number; food: FoodState }) {
      const mealIndex = getMealIndexRequired(this.data.meals, data.mealId);
      this.data.meals[mealIndex].foods.push(data.food);
    },

    setFoods(data: { mealId: number; foods: FoodState[] }) {
      const mealIndex = getMealIndexRequired(this.data.meals, data.mealId);
      this.data.meals[mealIndex].foods = data.foods;
    },
    getNextFoodId(): number {
      return this.data.nextFoodId++;
    },
    getNextMealId(): number {
      return this.data.nextMealId++;
    },
    setContinueButtonEnabled(enabled: boolean): void {
      this.data.continueButtonEnabled = enabled;
    },
  },
});

export type SurveyStoreDef = typeof useSurvey;

export type SurveyStore = ReturnType<SurveyStoreDef>;
