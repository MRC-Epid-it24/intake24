import type { Ref } from 'vue';
import { computed } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useLocale } from '@intake24/ui';
import { fromMealTime } from '@intake24/ui/util';

export const useMealUtils = <T extends MealState | undefined>(meal?: Ref<T>) => {
  const { getLocaleContent } = useLocale();

  const getMealName = (mealState: MealState) => getLocaleContent(mealState.name);

  const mealName = computed(() => (meal?.value ? getMealName(meal.value) : undefined));

  const getMealTime = (mealState?: MealState) =>
    mealState?.time ? fromMealTime(mealState.time) : undefined;

  const mealTime = computed(() => getMealTime(meal?.value));

  const getMealNameWithTime = (mealState: MealState) => {
    const mealName = getMealName(mealState);
    const mealTime = getMealTime(mealState);

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
