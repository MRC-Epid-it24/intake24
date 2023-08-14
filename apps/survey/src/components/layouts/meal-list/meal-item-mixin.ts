import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import type { MenuItem } from '@intake24/survey/components/elements';
import { useI18n } from '@intake24/i18n';
import { ContextMenu } from '@intake24/survey/components/elements';
import { useMealUtils } from '@intake24/survey/composables';

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

  emits: ['action'],

  setup(props, { emit }) {
    const { i18n, translate } = useI18n();
    const { mealName, mealTime } = useMealUtils(props);

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
        name: i18n.t('recall.menu.meal.delete').toString(),
        action: 'deleteMeal',
        dialog: true,
        icon: '$delete',
      },
    ]);

    const mealSelected = () => {
      action('selectMeal', props.meal.id);
    };

    const action = (type: FoodActionType | MealActionType, id?: string) => {
      emit('action', type, id);
    };

    return { action, translate, menu, mealName, mealTime, mealSelected };
  },
});
