import type { SetupContext } from 'vue';
import { computed } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useMealUtils } from '@intake24/survey/composables';

import type { MenuItem } from './use-food-item';

export type UseMealItemProps = {
  meal: MealState;
  selectedFoodId?: string;
  selectedFoodInMeal: boolean;
  selectedMealId?: string;
};

export function useMealItem(props: UseMealItemProps, { emit }: SetupContext) {
  const { i18n, translate } = useI18n();
  const { mealName, mealTime } = useMealUtils(props);

  const isSelected = computed(() => props.selectedMealId === props.meal.id);

  const menu = computed(() =>
    (
      [
        {
          name: i18n.t('recall.menu.meal.editFoods').toString(),
          action: 'editMeal',
          icon: '$meal',
          if: (meal: MealState) => meal.flags.includes('free-entry-complete'),
        },
        {
          name: i18n.t('recall.menu.meal.editTime').toString(),
          action: 'mealTime',
          icon: '$mealTime',
          if: (meal: MealState) => !meal.flags.includes('meal-time:disabled'),
        },
        {
          name: i18n.t('recall.menu.meal.delete').toString(),
          action: 'deleteMeal',
          dialog: true,
          icon: '$delete',
        },
      ] satisfies MenuItem[]
    ).filter(item => !item.if || item.if(props.meal)),
  );

  const action = (type: FoodActionType | MealActionType, id?: string) => {
    emit('action', type, id);
  };

  return { action, isSelected, translate, menu, mealName, mealTime };
}
