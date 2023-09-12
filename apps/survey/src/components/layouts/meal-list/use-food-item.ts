import type { SetupContext } from 'vue';
import { computed, ref } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';
import { foodPortionSizeComplete, missingFoodComplete } from '@intake24/survey/util';

export type MenuItem = {
  name: string;
  action: FoodActionType | MealActionType;
  dialog?: boolean;
  icon?: string;
};

export type UseFoodItemProps = {
  food: FoodState;
  meal: MealState;
};

export const useFoodItem = (props: UseFoodItemProps, { emit }: SetupContext) => {
  const { i18n } = useI18n();
  const { foodName } = useFoodUtils(props);

  const isMissingFoodComplete = computed(() => missingFoodComplete(props.food));
  const isPortionSizeComplete = computed(() => foodPortionSizeComplete(props.food));

  const menu = ref<MenuItem[]>([
    {
      name: i18n.t('recall.menu.food.edit').toString(),
      action: 'editMeal',
      icon: '$meal',
    },
    {
      name: i18n.t('recall.menu.food.editPortionSize').toString(),
      action: 'editFood',
      icon: '$food',
    },
    {
      name: i18n.t('recall.menu.food.delete').toString(),
      action: 'deleteFood',
      dialog: true,
      icon: '$delete',
    },
  ]);

  const action = (type: FoodActionType | MealActionType, id?: string) => {
    emit('action', type, id);
  };

  return { action, foodName, isMissingFoodComplete, isPortionSizeComplete, menu };
};
