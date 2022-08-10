import type { TranslateResult } from 'vue-i18n';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState, LocaleTranslation } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

import localeContent from './localeContent';

export type BrdCrumbs = {
  text: string | TranslateResult | null;
  disabled: boolean;
};

export default defineComponent({
  mixins: [localeContent],

  computed: {
    ...mapState(useSurvey, ['selectedMealOptional', 'selectedFoodOptional']),
  },

  methods: {
    // FIXME: need to return based on users locale. For now either english or localDescription
    getFood(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food')
        return food.data.localName ? food.data.englishName : food.data.localName;
      return '';
    },

    getBreadCrumbs(promptName: LocaleTranslation): BrdCrumbs[] {
      const localMealName: string | null = this.selectedMealOptional
        ? this.getLocaleContent(this.selectedMealOptional.name)
        : null;
      return [
        {
          text: localMealName !== null ? localMealName : this.$t('breadcrumbs.meal'),
          disabled: !this.selectedMeal,
        },
        {
          text: this.selectedFoodOptional
            ? this.getFood(this.selectedFoodOptional)
            : this.$t('breadcrumbs.food'),
          disabled: !this.selectedFood,
        },
        {
          text: promptName ? this.getLocaleContent(promptName) : this.$t('breadcrumbs.prompt'),
          disabled: !promptName,
        },
      ];
    },
  },
});
