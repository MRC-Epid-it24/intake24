import { computed } from 'vue';

import type { EncodedFood, FoodState } from '@intake24/common/types';
import { capitalize } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

export type UseFoodUtilsProps<
  F extends FoodState | undefined,
  P extends EncodedFood | undefined,
> = {
  food?: F;
  parentFood?: P;
};

export const useFoodUtils = <F extends FoodState | undefined, P extends EncodedFood | undefined>({
  food,
  parentFood,
}: UseFoodUtilsProps<F, P> = {}) => {
  const { translate } = useI18n();

  const getFoodName = (foodState: FoodState) => {
    if (foodState.type === 'encoded-food') return translate(foodState.data.localName);
    if (foodState.type === 'missing-food')
      return capitalize(foodState.info?.name ?? foodState.searchTerm ?? '??');

    return capitalize(foodState.description);
  };

  const foodName = computed(
    () => (food ? getFoodName(food) : undefined) as F extends undefined ? undefined : string
  );
  const parentFoodName = computed(
    () =>
      (parentFood ? getFoodName(parentFood) : undefined) as P extends undefined ? undefined : string
  );

  return {
    foodName,
    getFoodName,
    parentFoodName,
  };
};
