import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
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

  data() {
    return {
      menuMealIcon: 'fas fa-edit',
      menuMeal: [
        {
          name: this.$t('recall.menu.meal.editFoodInMeal'),
          action: 'editMeal',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.editMealTime'),
          action: 'mealTime',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.deleteMeal'),
          action: 'deleteMeal',
          dialog: true,
        },
      ],
    };
  },

  computed: {
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
