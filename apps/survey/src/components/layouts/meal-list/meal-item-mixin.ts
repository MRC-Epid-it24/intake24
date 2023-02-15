import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import type { MenuItem } from '@intake24/survey/components/elements';
import { ContextMenu } from '@intake24/survey/components/elements';
import { localeContent } from '@intake24/survey/components/mixins';
import { fromMealTime } from '@intake24/survey/stores/meal-food-utils';

import FoodItem from './food-item.vue';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  mixins: [localeContent],

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
      type: Number,
      required: false,
    },
  },

  emits: ['food-selected', 'meal-selected', 'meal-action'],

  data() {
    return { icon: '$edit' };
  },

  computed: {
    localeMealName() {
      return this.getLocaleContent(this.meal.name);
    },

    menu(): MenuItem[] {
      return [
        {
          name: this.$t('recall.menu.meal.editFoodInMeal').toString(),
          action: 'editMeal',
          icon: '$food',
        },
        {
          name: this.$t('recall.menu.meal.editMealTime').toString(),
          action: 'mealTime',
          icon: '$mealTime',
        },
        {
          name: this.$t('prompts.editMeal.delete._', { item: this.localeMealName }).toString(),
          action: 'deleteMeal',
          dialog: true,
          icon: '$delete',
        },
      ];
    },
    mealTimeString(): string {
      return this.meal.time ? fromMealTime(this.meal.time, true) : '';
    },
  },

  methods: {
    foodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    mealSelected() {
      this.$emit('meal-selected', this.meal.id);
    },
    action(type: string) {
      this.$emit('meal-action', { mealId: this.meal.id, type });
    },
  },
});
