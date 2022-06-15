import { defineStore } from 'pinia';
import type { FoodHeader } from '@intake24/common/types/http';

export interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

export interface MealAssociatedFoodsState {
  activePrompt: number;
  prompts: AssociatedFoodPromptState[];
}

export interface AssociatedFoodsState {
  associatedFoodsState: { [key: number]: MealAssociatedFoodsState };
}

export const useAssociatedFoodsState = defineStore('associatedFoodsState', {
  state: (): AssociatedFoodsState => ({
    associatedFoodsState: {},
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}associated-foods`,
  },
  actions: {
    updateAssociatedFoods(mealId: number, data: MealAssociatedFoodsState) {
      console.log(`updating store assoc...`);
      this.associatedFoodsState = { ...this.associatedFoodsState, [mealId]: { ...data } };
    },
  },
});

export type AssociatedFoodsStoreDef = typeof useAssociatedFoodsState;

export type AssociatedFoodsStore = ReturnType<AssociatedFoodsStoreDef>;
