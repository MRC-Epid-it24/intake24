import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState, Selection } from '@intake24/common/types';
import { capitalize } from '@intake24/common/util';
import { RequestHelp } from '@intake24/survey/components';
import { localeContent } from '@intake24/survey/components/mixins';
import {
  findFood,
  findMeal,
  fromMealTime,
  getFoodIndexRequired,
} from '@intake24/survey/stores/meal-food-utils';

export type BreadcrumbsElement = {
  text: string;
  disabled: boolean;
};

export default defineComponent({
  name: 'BreadcrumbsMixin',

  components: { RequestHelp },

  mixins: [localeContent],

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    promptName: {
      type: String,
      required: true,
    },
    selection: {
      type: Object as PropType<Selection>,
      required: true,
    },
  },

  data() {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
  },

  computed: {
    getBreadCrumbs(): BreadcrumbsElement[] {
      const elements: BreadcrumbsElement[] = [];

      const mealElement = this.getMealElement();
      const foodElement = this.getFoodElement();
      const promptElement = { text: this.promptName, disabled: false };

      if (mealElement) {
        elements.push(mealElement);
      } else {
        elements.push({
          text: this.asPlainString(this.$t('breadcrumbs.general')),
          disabled: false,
        });
      }

      if (foodElement) elements.push(foodElement);

      elements.push(promptElement);

      return elements;
    },
  },

  methods: {
    getMealLabel(meal: MealState, mealTime = true) {
      if (!mealTime) return this.getLocaleContent(meal.name);

      return [
        this.getLocaleContent(meal.name),
        meal.time ? `(${fromMealTime(meal.time, true)})` : '',
      ]
        .filter(Boolean)
        .join(' ');
    },

    getFoodElement(): BreadcrumbsElement | undefined {
      if (this.selection.element?.type != 'food') return undefined;

      const food = findFood(this.meals, this.selection.element.foodId);
      if (food.type === 'free-text') return { text: capitalize(food.description), disabled: false };

      return { text: food.data.localName ?? food.data.englishName, disabled: false };
    },

    getMealElement(): BreadcrumbsElement | undefined {
      if (this.selection.element === null) return undefined;

      switch (this.selection.element.type) {
        case 'food': {
          const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);

          return {
            text: this.getMealLabel(this.meals[foodIndex.mealIndex]),
            disabled: false,
          };
        }
        case 'meal': {
          const meal = findMeal(this.meals, this.selection.element.mealId);

          return {
            text: this.getMealLabel(meal),
            disabled: false,
          };
        }
      }
    },
  },
});
