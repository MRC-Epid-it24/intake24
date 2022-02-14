import { mapState } from 'pinia';
import Vue, { VueConstructor } from 'vue';
import { TranslateResult } from 'vue-i18n';
import { FoodState, LocaleTranslation } from '@intake24/common/types';
import localeContent, { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import { useSurvey } from '@intake24/survey/stores';

export type BrdCrumbs = {
  text: string | TranslateResult | null;
  disabled: boolean;
};

export type BreadCrumbsContent = {
  getBreadCrumbs(promptName: LocaleTranslation): BrdCrumbs[];
};

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  mixins: [localeContent],
  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex', 'selectedFood']),
  },

  methods: {
    // FIXME: need to return based on users locale. For now either english or localDescription
    getFood(food: FoodState): string {
      if (!food) return '';
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food')
        return food.data.localName ? food.data.englishName : food.data.localName;
      return '';
    },

    getBreadCrumbs(promptName: LocaleTranslation): BrdCrumbs[] {
      const localMealName: string | null = this.selectedMeal
        ? this.getLocaleContent(this.selectedMeal.localName)
        : null;
      return [
        {
          text: localMealName !== null ? localMealName : this.$t('breadcrumbs.meal'),
          disabled: !this.selectedMeal,
        },
        {
          text: this.selectedFood ? this.getFood(this.selectedFood) : this.$t('breadcrumbs.food'),
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
