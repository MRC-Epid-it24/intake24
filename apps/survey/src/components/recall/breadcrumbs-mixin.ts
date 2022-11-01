import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import { RequestHelp } from '@intake24/survey/components';
import { useSurvey } from '@intake24/survey/stores';
import { findFood, findMeal, getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';
import { ConfirmDialog } from '@intake24/ui/components';

import localeContent from '../mixins/localeContent';

export type BreadcrumbsElement = {
  text: string;
  disabled: boolean;
};

export default defineComponent({
  name: 'BreadcrumbsMixin',

  components: { RequestHelp, ConfirmDialog },

  mixins: [localeContent],

  props: {
    promptName: {
      type: Object as PropType<RequiredLocaleTranslation>,
      required: true,
    },
  },

  data() {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
  },

  computed: {
    ...mapState(useSurvey, ['selection', 'meals']),
  },

  methods: {
    getFoodElement(): BreadcrumbsElement | undefined {
      if (this.selection.element === null || this.selection.element.type != 'food')
        return undefined;

      const food = findFood(this.meals, this.selection.element.foodId);

      switch (food.type) {
        case 'free-text':
          return {
            text: food.description,
            disabled: false,
          };
        case 'encoded-food':
          return {
            text: food.data.localName ? food.data.englishName : food.data.localName,
            disabled: false,
          };
      }
    },

    getMealElement(): BreadcrumbsElement | undefined {
      if (this.selection.element === null) return undefined;

      switch (this.selection.element.type) {
        case 'food': {
          const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);
          return {
            text: this.getLocaleContent(this.meals[foodIndex.mealIndex].name),
            disabled: false,
          };
        }
        case 'meal': {
          const meal = findMeal(this.meals, this.selection.element.mealId);
          return {
            text: this.getLocaleContent(meal.name),
            disabled: false,
          };
        }
      }
    },

    getBreadCrumbs(promptName: RequiredLocaleTranslation): BreadcrumbsElement[] {
      const elements: BreadcrumbsElement[] = [];

      const mealElement = this.getMealElement();
      const foodElement = this.getFoodElement();
      const promptElement = {
        text: this.getLocaleContent(promptName),
        disabled: false,
      };

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
});
