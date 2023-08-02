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
  MissingFood,
  PromptAnswer,
  Selection,
  SurveyFlag,
  SurveyState as CurrentSurveyState,
} from '@intake24/common/types';
import type { SurveyEntryResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import { sortMeals, toMealTime } from '@intake24/common/surveys';
import { clearPromptStores, recallLog } from '@intake24/survey/stores';
import {
  findFood,
  findMeal,
  getEntityId,
  getFoodIndex,
  getFoodIndexRequired,
  getMealIndex,
  getMealIndexForSelection,
  getMealIndexRequired,
} from '@intake24/survey/util';
import { useLoading } from '@intake24/ui/stores';

import { isPortionSizeComplete } from '../dynamic-recall/portion-size-checks';
import { surveyService } from '../services';
import { promptStores } from './prompt';
import { useSameAsBefore } from './same-as-before';

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
  user: SurveyUserInfoResponse | null;
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
});

const canUseUserSession = (state: CurrentSurveyState, parameters?: SurveyEntryResponse) => {
  if (parameters && !parameters.storeUserSessionOnServer) return false;

  const { startTime /*, submissionTime */ } = state;
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
    recallAllowed(): boolean {
      return this.surveyEnabled && !this.limitReached;
    },
    recallNumber(): number {
      return (this.user?.submissions ?? 1) + (this.isSubmitted ? 0 : 1);
    },
    feedbackEnabled: (state) => !!state.parameters?.feedbackScheme,
    feedbackAvailable: (state) => !!state.user?.showFeedback,
    feedbackAllowed(): boolean {
      return this.feedbackEnabled && this.feedbackAvailable;
    },
    hasStarted: (state) => !!state.data.startTime,
    hasFinished: (state) => !!state.data.endTime,
    isSubmitted: (state) => !!state.data.submissionTime,
    localeId: (state) => state.parameters?.locale.code ?? 'en_GB',
    meals: (state) => state.data.meals,
    hasMeals: (state) => !!state.data.meals.length,
    defaultSchemeMeals: (state) => state.parameters?.surveyScheme.meals,
    registeredPortionSizeMethods: (state) =>
      state.parameters?.surveyScheme.prompts.meals.foods
        .filter((item) => item.type === 'portion-size')
        .map((item) => item.component.replace('-prompt', '')) ?? [],
    sameAsBeforeAllowed: (state) =>
      !!state.parameters?.surveyScheme.prompts.meals.foods.find(
        (item) => item.component === 'same-as-before-prompt'
      ),
    selection: (state) => state.data.selection,
    freeEntryComplete: (state) =>
      !!state.data.meals.length &&
      state.data.meals.every((meal) => meal.flags.includes('free-entry-complete')),
    currentTempPromptAnswer: (state): PromptAnswer | undefined => {
      return state.data.tempPromptAnswer;
    },
    selectedMealIndex(): number | undefined {
      const { element } = this.data.selection;

      if (element === null) return undefined;
      if (element.type !== 'meal') {
        return getMealIndexForSelection(this.data.meals, this.data.selection);
      }

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
        meals: this.parameters.surveyScheme.meals.map((meal) => ({
          id: getEntityId(),
          name: meal.name,
          defaultTime: toMealTime(meal.time),
          time: undefined,
          duration: null,
          flags: [],
          customPromptAnswers: {},
          foods: [],
        })),
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
        clearPromptStores();
      } finally {
        this.isSubmitting = false;
      }
    },

    setSelection(selection: Selection) {
      this.data.selection = selection;
      recallLog().selectionChanged(selection);
    },

    setAutoSelection() {
      this.setSelection({ mode: 'auto', element: null });
    },

    setCustomPromptAnswer(data: { promptId: string; answer: CustomPromptAnswer }) {
      this.data.customPromptAnswers = {
        ...this.data.customPromptAnswers,
        [data.promptId]: data.answer,
      };
    },

    hasFlag(flag: SurveyFlag) {
      return this.data.flags.includes(flag);
    },

    addFlag(flag: SurveyFlag | SurveyFlag[]) {
      const flags = Array.isArray(flag) ? flag : [flag];

      flags.filter((flag) => this.data.flags.includes(flag));
      if (!flags.length) return;

      this.data.flags.push(...flags);
    },

    removeFlag(flag: SurveyFlag | SurveyFlag[]) {
      const flags = Array.isArray(flag) ? flag : [flag];

      this.data.flags = this.data.flags.filter((flag) => !flags.includes(flag as SurveyFlag));
    },

    sortMeals() {
      this.data.meals.sort(sortMeals);
    },

    setMealDuration(mealId: string, duration: number) {
      const mealIndex = getMealIndexRequired(this.data.meals, mealId);

      this.data.meals[mealIndex].duration = duration;
    },

    setMealTime(mealId: string, time: MealTime) {
      const mealIndex = getMealIndexRequired(this.data.meals, mealId);

      this.data.meals[mealIndex].time = time;
      this.sortMeals();
    },

    deleteMeal(mealId: string) {
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
      this.sortMeals();
    },

    undoDeleteMeal(data: { mealIndex: number; meal: MealState }) {
      this.data.meals.splice(data.mealIndex, 0, data.meal);
    },

    addMeal(name: string, locale: string) {
      const id = getEntityId();
      const defaultTime = toMealTime(
        this.defaultSchemeMeals?.find((meal) => meal.name[locale] === name)?.time ?? '8:00'
      );

      this.data.meals.push({
        id,
        name: { en: name, [locale]: name },
        defaultTime,
        time: undefined,
        duration: null,
        flags: [],
        foods: [],
        customPromptAnswers: {},
      });

      this.sortMeals();

      return id;
    },

    hasMealFlag(mealId: string, flag: SurveyFlag) {
      const meal = findMeal(this.data.meals, mealId);

      return meal.flags.includes(flag);
    },

    addMealFlag(mealId: string, flag: MealFlag | MealFlag[]) {
      const meal = findMeal(this.data.meals, mealId);
      const flags = Array.isArray(flag) ? flag : [flag];

      flags.filter((flag) => meal.flags.includes(flag));
      if (!flags.length) return;

      meal.flags.push(...flags);
    },

    removeMealFlag(mealId: string, flag: MealFlag | MealFlag[]) {
      const meal = findMeal(this.data.meals, mealId);
      const flags = Array.isArray(flag) ? flag : [flag];

      meal.flags = meal.flags.filter((flag) => !flags.includes(flag as MealFlag));
    },

    setMealCustomPromptAnswer(data: {
      mealId: string;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      const meal = findMeal(this.data.meals, data.mealId);

      meal.customPromptAnswers = { ...meal.customPromptAnswers, [data.promptId]: data.answer };
    },

    setFoodCustomPromptAnswer(data: {
      foodId: string;
      promptId: string;
      answer: CustomPromptAnswer;
    }) {
      const food = findFood(this.data.meals, data.foodId);

      food.customPromptAnswers[data.promptId] = data.answer;
    },

    hasFoodFlag(foodId: string, flag: SurveyFlag) {
      const food = findFood(this.data.meals, foodId);

      return food.flags.includes(flag);
    },

    addFoodFlag(foodId: string, flag: FoodFlag | FoodFlag[]) {
      const food = findFood(this.data.meals, foodId);
      const flags = Array.isArray(flag) ? flag : [flag];

      flags.filter((flag) => food.flags.includes(flag));
      if (!flags.length) return;

      food.flags.push(...flags);

      if (flags.includes('portion-size-method-complete')) this.saveSameAsBefore(foodId);
    },

    removeFoodFlag(foodId: string, flag: FoodFlag | FoodFlag[]) {
      const food = findFood(this.data.meals, foodId);
      const flags = Array.isArray(flag) ? flag : [flag];

      food.flags = food.flags.filter((flag) => !flags.includes(flag as FoodFlag));
    },

    replaceFood(data: { foodId: string; food: FoodState }) {
      const { foodIndex, mealIndex, linkedFoodIndex } = getFoodIndexRequired(
        this.data.meals,
        data.foodId
      );

      if (linkedFoodIndex === undefined) {
        this.data.meals[mealIndex].foods.splice(foodIndex, 1, data.food);
      } else {
        this.data.meals[mealIndex].foods[foodIndex].linkedFoods.splice(
          linkedFoodIndex,
          1,
          data.food
        );
      }
    },

    /*
     * Save to `same-as-before` for encoded foods with finished portion size estimation
     * - triggered when 'portion-size-method-complete' flag added
     */
    saveSameAsBefore(foodId: string) {
      // TODO: check associated foods ?
      if (!this.sameAsBeforeAllowed) return;

      const { foodIndex, mealIndex, linkedFoodIndex } = getFoodIndexRequired(
        this.data.meals,
        foodId
      );

      const mainFood = this.data.meals[mealIndex].foods[foodIndex];

      if (
        mainFood.type !== 'encoded-food' ||
        !isPortionSizeComplete(mainFood) ||
        (linkedFoodIndex !== undefined &&
          !isPortionSizeComplete(
            this.data.meals[mealIndex].foods[foodIndex].linkedFoods[linkedFoodIndex]
          ))
      )
        return;

      useSameAsBefore().saveItem(this.localeId, mainFood);
    },

    editFood(foodId: string) {
      const food = findFood(this.data.meals, foodId);
      if (food.type === 'free-text') return;

      const flags: FoodFlag[] = [];
      if (food.type === 'encoded-food') {
        flags.push('portion-size-method-complete');

        if (food.data.portionSizeMethods.length > 1) flags.push('portion-size-option-complete');
      }
      if (food.type === 'missing-food') flags.push('missing-food-complete');

      this.removeFoodFlag(foodId, flags);
    },

    updateFood(data: {
      foodId: string;
      update:
        | Partial<Omit<FreeTextFood, 'type'>>
        | Partial<Omit<EncodedFood, 'type'>>
        | Partial<Omit<MissingFood, 'type'>>;
    }) {
      const foodState = findFood(this.meals, data.foodId);
      this.replaceFood({ foodId: data.foodId, food: { ...foodState, ...data.update } });
    },

    deleteFood(foodId: string) {
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

    addFood({ mealId, food, at }: { mealId: string; food: FoodState; at?: number }) {
      const mealIndex = getMealIndexRequired(this.data.meals, mealId);

      if (at !== undefined) this.data.meals[mealIndex].foods.splice(at, 0, food);
      else this.data.meals[mealIndex].foods.push(food);
    },

    setFoods(data: { mealId: string; foods: FoodState[] }) {
      const mealIndex = getMealIndexRequired(this.data.meals, data.mealId);
      this.data.meals[mealIndex].foods = data.foods;
    },
  },
});

export type SurveyStoreDef = typeof useSurvey;

export type SurveyStore = ReturnType<SurveyStoreDef>;
