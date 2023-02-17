import { computed } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { capitalize } from '@intake24/common/util';

import { useLocale } from './use-locale';

export const useFoodUtils = <T extends FoodState | undefined>(food?: T) => {
  const { getLocaleContent } = useLocale();

  const getFoodName = (food: FoodState) => {
    if (food.type === 'encoded-food') return getLocaleContent(food.data.localName);
    if (food.type === 'missing-food') return capitalize(food.info?.name ?? food.searchTerm);

    return capitalize(food.description);
  };

  const foodName = computed(() => (food ? getFoodName(food) : undefined));

  return {
    foodName,
    getFoodName,
  };
};
