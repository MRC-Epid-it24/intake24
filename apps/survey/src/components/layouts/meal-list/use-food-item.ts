import type { SetupContext } from 'vue';
import { computed } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';
import { foodComplete, foodPortionSizeComplete } from '@intake24/survey/util';

export type MenuItem = {
  name: string;
  action: FoodActionType | MealActionType;
  dialog?: boolean;
  icon?: string;
  if?: (item: any) => boolean;
};

export type UseFoodItemProps = {
  food: FoodState;
  meal: MealState;
};

export function useFoodItem(props: UseFoodItemProps, { emit }: SetupContext) {
  const { i18n } = useI18n();
  const { foodName } = useFoodUtils(props);

  const isPortionSizeComplete = computed(() => foodPortionSizeComplete(props.food));

  const menu = computed(() =>
    (
      [
        {
          name: i18n.t('recall.menu.food.change').toString(),
          action: 'changeFood',
          icon: '$meal',
        },
        {
          name: i18n.t(`recall.menu.food.${props.food.type}.edit`).toString(),
          action: 'editFood',
          icon: '$food',
          if: (food: FoodState) => foodComplete(food),
        },
        {
          name: i18n.t('recall.menu.food.delete').toString(),
          action: 'deleteFood',
          dialog: true,
          icon: '$delete',
        },
      ] satisfies MenuItem[]
    ).filter(item => !item.if || item.if(props.food)),
  );

  const action = (type: FoodActionType | MealActionType, id?: string) => {
    emit('action', type, id);
  };

  return { action, foodName, isPortionSizeComplete, menu };
}
