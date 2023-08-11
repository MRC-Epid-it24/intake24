import type { Ref } from 'vue';
import { mapState } from 'pinia';
import { computed } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/util';

export const useMealListUtils = <M extends any[]>(meals: Ref<M>) => {
  const { selection } = mapState(useSurvey, ['selection']);

  const selectedMealId = computed(() => {
    if (selection.element?.type !== 'meal') return undefined;
    return selection.element.mealId;
  });

  const selectedFoodId = computed(() => {
    if (selection.element?.type !== 'food') return undefined;
    return selection.element.foodId;
  });

  const isSelectedFoodInMeal = (mealId: string) => {
    if (selection.element?.type !== 'food') return false;

    const foodIndex = getFoodIndexRequired(meals.value, selection.element.foodId);

    return meals.value[foodIndex.mealIndex].id === mealId;
  };

  const action = (type: FoodActionType | MealActionType, id?: string) => {
    // This action will be overridden in the components
  };

  const foodSelected = (foodId: string) => {
    action('selectFood', foodId);
  };

  const mealSelected = (mealId: string) => {
    action('selectMeal', mealId);
  };

  return {
    selectedMealId,
    selectedFoodId,
    isSelectedFoodInMeal,
    action,
    foodSelected,
    mealSelected,
  };
};
