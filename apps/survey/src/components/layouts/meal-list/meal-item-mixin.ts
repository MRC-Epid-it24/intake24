import type { PropType } from 'vue';
import { defineComponent, ref, toRefs } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import type { MenuItem } from '@intake24/survey/components/elements';
import { useI18n } from '@intake24/i18n';
import { ContextMenu } from '@intake24/survey/components/elements';
import { useLocale, useMealUtils } from '@intake24/survey/composables';

import FoodItem from './food-item.vue';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    selectedFoodInMeal: {
      type: Boolean,
      required: true,
    },
    selectedFoodId: {
      type: String,
      required: false,
    },
  },

  emits: ['food-selected', 'meal-selected', 'action'],

  setup(props, { emit }) {
    const { meal } = toRefs(props);

    const i18n = useI18n();
    const { getLocaleContent } = useLocale();
    const { mealName, mealTime } = useMealUtils(meal);

    const menu = ref<MenuItem[]>([
      {
        name: i18n.t('recall.menu.meal.editFoods').toString(),
        action: 'editMeal',
        icon: '$food',
      },
      {
        name: i18n.t('recall.menu.meal.editTime').toString(),
        action: 'mealTime',
        icon: '$mealTime',
      },
      {
        name: i18n.t('recall.menu.delete._', { item: mealName.value }).toString(),
        action: 'deleteMeal',
        dialog: true,
        icon: '$delete',
      },
    ]);

    const foodSelected = (foodId: number) => {
      emit('food-selected', foodId);
    };

    const mealSelected = () => {
      emit('meal-selected', props.meal.id);
    };

    const action = (type: FoodActionType | MealActionType, id?: string) => {
      emit('action', type, id);
    };

    return { action, getLocaleContent, menu, mealName, mealTime, foodSelected, mealSelected };
  },
});
