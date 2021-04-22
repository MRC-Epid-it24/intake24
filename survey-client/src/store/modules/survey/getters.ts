import { GetterTree } from 'vuex';
import { RootState, SurveyState } from '@/types/vuex';
import { MealState2, Selection2 } from '@common/types';

const getters: GetterTree<SurveyState, RootState> = {
  parametersLoaded: (state) => !!state.parameters,

  meals: (state): MealState2[] | undefined => {
    return state.data?.meals;
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
};

export default getters;
