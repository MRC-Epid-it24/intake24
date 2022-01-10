import { GetterTree } from 'vuex';
import {
  FoodState,
  Meals,
  MealState,
  Selection,
  SurveyState as CurrentSurveyState,
} from '@intake24/common/types';
import { FoodUndo, MealUndo, RootState, SurveyState } from '@intake24/survey/types/vuex';

const getters: GetterTree<SurveyState, RootState> = {
  parametersLoaded: (state) => !!state.parameters && !!state.user,
  error: (state) => state.error,

  currentState: (state): CurrentSurveyState => {
    return state.data;
  },

  hasStarted: (state): boolean => {
    return !!state.data.startTime;
  },

  hasFinished: (state): boolean => {
    return !!state.data.endTime;
  },

  meals: (state): MealState[] | undefined => {
    return state.data.meals;
  },

  defaultSchemeMeals: (state): Meals | undefined => {
    return state.parameters?.scheme.meals;
  },

  selection: (state): Selection | undefined => {
    return state.data.selection;
  },

  selectedMealIndex: (state): number | undefined => {
    return state.data.selection.element?.mealIndex;
  },

  selectedMeal: (state): MealState | undefined => {
    const mealIndex = state.data.selection.element?.mealIndex;
    const { meals } = state.data;

    if (mealIndex === undefined) return undefined;
    return meals[mealIndex];
  },

  undoEntity: (state): MealUndo | FoodUndo | null => {
    const undoEntity = state.undo;
    return undoEntity;
  },

  selectedFood: (state): FoodState | undefined => {
    const { element } = state.data.selection;

    if (element === null || element.type !== 'food') return undefined;

    return state.data.meals[element.mealIndex].foods[element.foodIndex];
  },

  selectedFoodIndex: (state): number | undefined => {
    const { element } = state.data.selection;

    if (element === null || element.type !== 'food') return undefined;

    return element.foodIndex;
  },
};

export default getters;
