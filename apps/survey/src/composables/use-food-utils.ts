import type { Ref } from 'vue';
import { computed } from 'vue';

import type { EncodedFood, FoodState } from '@intake24/common/types';
import { capitalize } from '@intake24/common/util';
import { useLocale } from '@intake24/ui';

export const useFoodUtils = <F extends FoodState | undefined, P extends EncodedFood | undefined>(
  food?: Ref<F>,
  parentFood?: Ref<P>
) => {
  const { getLocaleContent } = useLocale();

  const getFoodName = (foodState: FoodState) => {
    if (foodState.type === 'encoded-food') return getLocaleContent(foodState.data.localName);
    if (foodState.type === 'missing-food')
      return capitalize(foodState.info?.name ?? foodState.searchTerm);

    return capitalize(foodState.description);
  };

  const foodName = computed(
    () =>
      (food?.value ? getFoodName(food.value) : undefined) as F extends undefined
        ? undefined
        : string
  );
  const parentFoodName = computed(
    () =>
      (parentFood?.value ? getFoodName(parentFood.value) : undefined) as P extends undefined
        ? undefined
        : string
  );

  return {
    foodName,
    getFoodName,
    parentFoodName,
  };
};
