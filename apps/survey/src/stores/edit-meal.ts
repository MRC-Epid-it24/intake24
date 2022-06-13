import { defineStore } from 'pinia';
import { FoodState } from '@intake24/common/types';

export interface EditMealState {
  mealState: { [key: number]: FoodState[] };
}

export const useEditMealState = defineStore('edit-meal-state', {
  state: (): EditMealState => ({
    mealState: {},
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}edit_meal`,
  },
  actions: {
    updateMealState(mealId: number, data: FoodState[]) {
      this.mealState = { ...this.mealState, [mealId]: data };
    },
    clearMealState(mealId: number) {
      this.mealState = { ...this.mealState };
      delete this.mealState[mealId];
    },
  },
});

export type EditMealStoreDef = typeof useEditMealState;

export type EditMealStore = ReturnType<EditMealStoreDef>;
