import type { SetupContext } from 'vue';
import { ref } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';

export type MenuItem = {
  name: string;
  action: FoodActionType | MealActionType;
  dialog?: boolean;
  icon?: string;
};

export type UseFoodItemProps = {
  food: FoodState;
};

export const useFoodItem = (props: UseFoodItemProps, { emit }: SetupContext) => {
  const { i18n } = useI18n();
  const { foodName } = useFoodUtils(props);

  const menu = ref<MenuItem[]>([
    {
      name: i18n.t('recall.menu.food.edit').toString(),
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

  const action = (type: FoodActionType, id?: string) => {
    emit('action', type, id);
  };

  return { action, foodName, menu };
};
