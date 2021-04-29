import { GetterTree } from 'vuex';
import { RootState, SurveyState } from '@/types/vuex';
import {
  FoodState,
  Meals,
  MealState2,
  Selection2,
  SurveyState as CurrentSurveyState,
} from '@common/types';

const getters: GetterTree<SurveyState, RootState> = {
  parametersLoaded: (state) => !!state.parameters,

  currentState: (state): CurrentSurveyState | null => {
    return state.data;
  },

  meals: (state): MealState2[] | undefined => {
    return state.data?.meals;
  },

  defaultSchemeMeals: (state): Meals | undefined => {
    return state.parameters?.scheme.meals;
  },

  selection: (state): Selection2 | undefined => {
    return state.data?.selection;
  },

  selectedMealIndex: (state): number | undefined => {
    return state.data?.selection.element?.mealIndex;
  },

  selectedMeal: (state): MealState2 | undefined => {
    const mealIndex = state.data?.selection.element?.mealIndex;
    const meals = state.data?.meals;

    if (meals === undefined || mealIndex === undefined) return undefined;

    return meals[mealIndex];
  },

  selectedFood: (state): FoodState | undefined => {
    if (state.data == null) return undefined;

    const { element } = state.data.selection;

    if (element == null) return undefined;

    if (element.type !== 'food') return undefined;

    return state.data.meals[element.mealIndex].foods[element.foodIndex];
  },

  selectedFoodIndex: (state): number | undefined => {
    if (state.data == null) return undefined;

    const { element } = state.data.selection;

    if (element == null) return undefined;

    if (element.type !== 'food') return undefined;

    return element.foodIndex;
  },
};

export default getters;
