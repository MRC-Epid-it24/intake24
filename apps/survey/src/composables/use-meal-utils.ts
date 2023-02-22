import { computed } from 'vue';

import type { MealState } from '@intake24/common/types';

import { fromMealTime } from '../util/meal-food-utils';
import { useLocale } from './use-locale';

export const useMealUtils = <T extends MealState | undefined>(meal?: T) => {
  const { getLocaleContent } = useLocale();

  const getMealName = (meal: MealState) => getLocaleContent(meal.name);

  const mealName = computed(() => (meal ? getMealName(meal) : undefined));

  const getMealTime = (meal?: MealState) =>
    meal?.time ? fromMealTime(meal.time, true) : undefined;

  const mealTime = computed(() => getMealTime(meal));

  const getMealNameWithTime = (meal: MealState) => {
    const mealName = getMealName(meal);
    const mealTime = getMealTime(meal);

    return mealName && mealTime ? `${mealName} (${mealTime})` : mealName;
  };

  const mealNameWithTime = computed(() =>
    mealName.value && mealTime.value ? `${mealName.value} (${mealTime.value})` : mealName.value
  );

  return {
    getMealName,
    getMealNameWithTime,
    getMealTime,
    mealName,
    mealNameWithTime,
    mealTime,
  };
};
