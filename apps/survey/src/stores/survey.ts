import 'lodash/debounce';

import { defineStore } from 'pinia';
import { v4 } from 'uuid';
import Vue from 'vue';

import type {
  CustomPromptAnswer,
  EncodedFood,
  FoodFlag,
  FoodState,
  FreeTextFood,
  MealFlag,
  MealState,
  MealTime,
  PromptAnswer,
  Selection,
  SurveyState as CurrentSurveyState,
} from '@intake24/common/types';
import type {
  SurveyEntryResponse,
  SurveyFollowUpResponse,
  SurveyUserInfoResponse,
} from '@intake24/common/types/http';
import { recallLog } from '@intake24/survey/stores';
import {
  findFood,
  findMeal,
  getFoodIndex,
  getFoodIndexRequired,
  getMealIndex,
  getMealIndexForSelection,
  getMealIndexRequired,
  toMealTime,
} from '@intake24/survey/stores/meal-food-utils';
import { useLoading } from '@intake24/ui/stores';

import { surveyService } from '../services';
import { promptStores } from './prompt';

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

export interface SurveyState {
  parameters: SurveyEntryResponse | null;
  user: SurveyUserInfoResponse | SurveyFollowUpResponse | null;
  data: CurrentSurveyState;
  isSubmitting: boolean;
  undo: MealUndo | FoodUndo | null;
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

export const surveyInitialState = (): CurrentSurveyState => ({
  schemeId: null,
  startTime: null,
  endTime: null,
  submissionTime: null,
  uxSessionId: v4(),
  flags: [],
  customPromptAnswers: {},
  tempPromptAnswer: {
    response: null,
    modified: false,
    new: true,
    finished: false,
    mealIndex: undefined,
    foodIndex: undefined,
    prompt: undefined,
  },
  selection: {
    element: null,
    mode: 'auto',
  },
  meals: [],
  nextFoodId: 0,
  nextMealId: 0,
});

const canUseUserSession = (state: CurrentSurveyState, parameters?: SurveyEntryResponse) => {
  if (parameters && !parameters.storeUserSessionOnServer) return false;

  const { startTime, submissionTime } = state;
  if (!startTime /*|| submissionTime*/) return false;

  // TODO: check old stale data

  return true;
};

export const useSurvey = defineStore('survey', {
  state: (): SurveyState => ({
    parameters: null,
    user: null,
    data: surveyInitialState(),
    isSubmitting: false,
    undo: null,
  }),
  debounce: {
    storeUserSession: 2500,
  },
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}survey`,
    paths: ['data'],
    afterRestore(context) {
      context.store.reCreateStoreAfterDeserialization();

      if (!canUseUserSession(context.store.$state.data)) context.store.clearState();
    },
  },
  getters: {
    parametersLoaded: (state) => !!state.parameters && !!state.user,
    currentState: (state) => state.data,
    surveyEnabled: (state) => state.parameters?.state === 'active',
    dailyLimitReached: (state) => !!state.user?.maximumDailySubmissionsReached,
    totalLimitReached: (state) => !!state.user?.maximumTotalSubmissionsReached,
    limitReached(): boolean {
      return !!(
        this.user?.maximumDailySubmissionsReached || this.user?.maximumTotalSubmissionsReached
      );
    },
    allowRecall(): boolean {
      return this.surveyEnabled && !this.limitReached;
    },
    feedbackEnabled: (state) => !!state.parameters?.feedbackScheme,
    feedbackAvailable: (state) => !!state.user?.showFeedback,
    allowFeedback(): boolean {
      return this.feedbackEnabled && this.feedbackAvailable;
    },
    hasStarted: (state) => !!state.data.startTime,
    hasFinished: (state) => !!state.data.endTime,
    isSubmitted: (state) => !!state.data.submissionTime,
    localeId: (state) => state.parameters?.locale.code ?? 'en_GB',
    meals: (state) => state.data.meals,
    hasMeals: (state) => !!state.data.meals.length,
    defaultSchemeMeals: (state) => state.parameters?.surveyScheme.meals,
    selection: (state) => state.data.selection,
    freeEntryComplete: (state) =>
      !!state.data.meals.length &&
      state.data.meals.every((meal) => meal.flags.includes('free-entry-complete')),
    currentTempPromptAnswer: (state): PromptAnswer | undefined => {
      return state.data.tempPromptAnswer;
    },
    selectedMealIndex(): number | undefined {
      const { element } = this.data.selection;

      if (element === null || element.type !== 'meal') return undefined;

      return getMealIndex(this.data.meals, element.mealId);
    },
    selectedMealOptional(): MealState | undefined {
      const mealIndex = this.selectedMealIndex;
      if (mealIndex === undefined) return undefined;

      return this.data.meals[mealIndex];
    },
    selectedFoodIndex(): MealFoodIndex | undefined {
      const { element } = this.data.selection;

      if (element === null || element.type !== 'food') return undefined;

      return getFoodIndex(this.data.meals, element.foodId);
    },
    selectedFoodOptional(): FoodState | undefined {
      const foodIndex = this.selectedFoodIndex;
      if (foodIndex === undefined) return undefined;

      if (foodIndex.linkedFoodIndex === undefined)
        return this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex];
      else
        return this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods[
          foodIndex.linkedFoodIndex
        ];
    },
    selectedParentFood(): FoodState | undefined {
      const foodIndex = this.selectedFoodIndex;
      if (foodIndex?.linkedFoodIndex === undefined) return undefined;

      return this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex];
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

        this.setParameters(surveyInfo);
        this.setUserInfo(userInfo);

        if (!surveyInfo.storeUserSessionOnServer) return;

        const userSession = await surveyService.getUserSession(surveyId);
        if (userSession) this.loadUserSession(userSession.sessionData);
      } finally {
        loading.removeItem('loadParameters');
      }
    },

    startRecall(force = false) {
      if (!this.parameters) {
        console.warn('Survey parameters are not loaded');
        return;
      }

      if (this.hasStarted && !this.isSubmitted && !force) {
        console.warn('Survey already started, not restarting.');
        return;
      }

      this.clearState();

      const initialState: CurrentSurveyState = {
        ...surveyInitialState(),
        schemeId: this.parameters.surveyScheme.id,
        startTime: new Date(),
        meals: this.parameters.surveyScheme.meals.map((meal, index) => ({
          id: index,
          name: meal.name,
          defaultTime: toMealTime(meal.time),
          time: undefined,
          flags: [],
          customPromptAnswers: {},
          foods: [],
        })),
        nextMealId: this.parameters.surveyScheme.meals.length + 1,
      };

      this.setState(initialState);
    },

    cancelRecall() {
      this.clearState();
      this.setState(surveyInitialState());
    },

    setState(payload: CurrentSurveyState) {
      this.data = payload;
      this.undo = null;
    },

    clearState() {
      promptStores.forEach((store) => store().$reset());

      /*
       * Prompt stores are created dynamically so we need to clear local storage manually
       * which can be out of sync if store is not created and stale data are in local storage
       */
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // TODO: prompt store should probably be prefixed with something as 'prompt-state' relies on ComponentType naming convention
        if (!key || !key.endsWith('prompt-state')) continue;

        localStorage.removeItem(key);
      }

      this.setState(surveyInitialState());
    },

    async clearUndo() {
      this.undo = null;
    },

    setParameters(parameters: SurveyEntryResponse) {
      this.parameters = parameters;
    },

    setUserInfo(user: SurveyUserInfoResponse) {
      this.user = user;
    },

    reCreateStoreAfterDeserialization() {
      ['startTime', 'endTime', 'submissionTime'].forEach((item) => {
        const key = item as keyof Pick<
          CurrentSurveyState,
          'startTime' | 'endTime' | 'submissionTime'
        >;

        const currentValue = this.data[key];
        if (typeof currentValue === 'string') this.data[key] = new Date(currentValue);
      });

      // Pinia plugin rehydrates the store without reactive getters/setters on undefined -> investigate
      this.data = {
        ...this.data,
        meals: this.data.meals.map((meal) => ({ ...meal, time: meal.time ?? undefined })),
      };
    },

    loadState(state: CurrentSurveyState) {
      this.setState(state);
      this.reCreateStoreAfterDeserialization();
    },

    loadUserSession(state: CurrentSurveyState) {
      if (!this.parameters) {
        console.error(`Survey parameters not loaded. Cannot load user session.`);
        return;
      }

      if (!canUseUserSession(state, this.parameters)) return;

      this.loadState(state);
    },

    async storeUserSession() {
      if (!this.parameters) {
        console.error(`Survey parameters not loaded. Cannot store user session.`);
        return;
      }

      if (this.isSubmitting || !canUseUserSession(this.data, this.parameters)) return;

      await surveyService.setUserSession(this.parameters.slug, this.data);
    },

    async submitRecall() {
      if (!this.parameters) {
        console.error(`Survey parameters not loaded. Cannot submit the survey.`);
        return;
      }

      this.data.endTime = new Date();
      this.isSubmitting = true;

      try {
        this.user = await surveyService.submit(this.parameters.slug, this.data);
        this.data.submissionTime = new Date();
      } finally {
        this.isSubmitting = false;
      }
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

        return { mode: 'auto', element: null };
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

    addMeal(name: string, locale: string) {
      const defaultTime = toMealTime(
        this.defaultSchemeMeals?.find((meal) => meal.name[locale] === name)?.time ?? '8:00'
      );

      this.data.meals.push({
        id: this.getNextMealId(),
        name: { en: name, [locale]: name },
        defaultTime,
        time: undefined,
        flags: [],
        foods: [],
        customPromptAnswers: {},
      });
    },

    setMealFlag(data: { mealId: number; flag: MealFlag }) {
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

      meal.customPromptAnswers = { ...meal.customPromptAnswers, [data.promptId]: data.answer };
    },

    setFoodCustomPromptAnswer(data: {
      foodId: number;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      const food = findFood(this.data.meals, data.foodId);

      food.customPromptAnswers[data.promptId] = data.answer;
    },

    setFoodFlag(data: { foodId: number; flag: FoodFlag }) {
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

    deleteFood(foodId: number) {
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

      const foodIndex = getFoodIndexRequired(this.data.meals, foodId);

      if (foodIndex.linkedFoodIndex === undefined) {
        this.data.meals[foodIndex.mealIndex].foods.splice(foodIndex.foodIndex, 1);
      } else {
        this.data.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods.splice(
          foodIndex.linkedFoodIndex,
          1
        );
      }

      // FIXME: update selection
      this.data.selection = { mode: 'auto', element: null };
    },

    addFood({ mealId, food, at }: { mealId: number; food: FoodState; at?: number }) {
      const mealIndex = getMealIndexRequired(this.data.meals, mealId);

      if (at !== undefined) this.data.meals[mealIndex].foods.splice(at, 0, food);
      else this.data.meals[mealIndex].foods.push(food);
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
  },
});

export type SurveyStoreDef = typeof useSurvey;

export type SurveyStore = ReturnType<SurveyStoreDef>;
