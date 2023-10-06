/*
 * Unused -- kept for reference
 *
 * An experimental monolithic temporary prompt state implementation
 *
 */

import { defineStore } from 'pinia';

import type { FoodState } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';

export interface AssociatedFoodPrompt {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

export interface MealAssociatedFoodsState {
  activePrompt: number;
  prompts: AssociatedFoodPrompt[];
}

type R1 = Record<'edit-meal-prompt', { [key: string]: FoodState[] }>;
type R2 = Record<'associated-foods-prompt', { [key: string]: MealAssociatedFoodsState }>;

type MealPromptState = Partial<R1 & R2>;

type FoodPromptState = Partial<
  Record<'associated-foods-prompt', { [key: string]: AssociatedFoodPrompt }>
>;

export interface PromptState {
  meals: { [key: number]: MealPromptState };
  foods: { [key: number]: FoodPromptState };
}

export const usePromptState = defineStore('promptState', {
  state: (): PromptState => ({
    meals: {},
    foods: {},
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}prompt-state`,
  },
  actions: {
    updateAssociatedFoods(mealId: number, promptId: string, data: MealAssociatedFoodsState) {
      this.meals[mealId] = {
        ...this.meals[mealId],
        'associated-foods-prompt': {
          ...this.meals[mealId]['associated-foods-prompt'],
          [promptId]: data,
        },
      };
    },
  },
});

export type PromptStateStoreDef = typeof usePromptState;

export type PromptStateStore = ReturnType<PromptStateStoreDef>;
