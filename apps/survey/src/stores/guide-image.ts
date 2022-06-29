import { defineStore } from 'pinia';
import type { EncodedFood } from '@intake24/common/types';

export interface GuideImageEncodedFood {
  objectIdx: number | null;
  food: EncodedFood;
  mealId: number | undefined;
  panelOpen: number;
}

export interface FoodGuideImageState {
  foodState: { [key: number]: GuideImageEncodedFood | Record<string, never> };
}

export const useFoodGuideImageState = defineStore('guide-image-state', {
  state: (): FoodGuideImageState => ({
    foodState: {},
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}guide_image`,
  },
  getters: {
    selectedObjectIndex: (state) => {
      return (foodId: number | undefined) => {
        console.log('This is ID Food Obj: ', foodId);
        if (foodId === undefined) return null;
        if (!state.foodState[foodId]) return null;
        if (
          state.foodState[foodId].food.portionSize !== null &&
          state.foodState[foodId].food.portionSize?.method === 'guide-image'
        ) {
          const objIdx = state.foodState[foodId].objectIdx;
          return objIdx !== null ? objIdx - 1 : null;
        }
        return null;
      };
    },
    selectedPanelState: (state) => {
      return (foodId: number | undefined) => {
        console.log('This is ID Food Panel: ', foodId);
        if (foodId === undefined) return 0;
        if (!state.foodState[foodId]) return 0;
        if (
          state.foodState[foodId].food.portionSize !== null &&
          state.foodState[foodId].food.portionSize?.method === 'guide-image'
        ) {
          const panelState = state.foodState[foodId].panelOpen;
          return panelState ?? 0;
        }
        return 0;
      };
    },
  },
  actions: {
    updateFoodState(
      mealId: number,
      foodId: number,
      data: EncodedFood,
      objIdx: number | null = null,
      panelOpen = 0
    ) {
      const newGuideState: GuideImageEncodedFood = {
        objectIdx: objIdx,
        food: data,
        mealId: mealId,
        panelOpen: panelOpen,
      };
      this.foodState = { ...this.foodState, [foodId]: newGuideState };
    },
    clearFoodState(foodId: number) {
      this.foodState = { ...this.foodState };
      delete this.foodState[foodId];
    },
  },
});

export type GuideImageFoodStoreDef = typeof useFoodGuideImageState;

export type GuideImageFoodStore = ReturnType<GuideImageFoodStoreDef>;
