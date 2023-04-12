import type { Ref } from 'vue';
import { computed } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { capitalize } from '@intake24/common/util';

import { useLocale } from './use-locale';

export const useFoodUtils = <T extends FoodState | undefined>(food?: Ref<T>) => {
  const { getLocaleContent } = useLocale();

  const getFoodName = (foodState: FoodState) => {
    if (foodState.type === 'encoded-food') return getLocaleContent(foodState.data.localName);
    if (foodState.type === 'missing-food')
      return capitalize(foodState.info?.name ?? foodState.searchTerm);

    return capitalize(foodState.description);
  };

  const foodName = computed(() => (food?.value ? getFoodName(food.value) : undefined));

  return {
    foodName,
    getFoodName,
  };
};
