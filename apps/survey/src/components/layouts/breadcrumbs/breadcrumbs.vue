<template>
  <v-card
    :class="{ 'breadcrumbs-mobile': isMobile, 'mb-4': !isMobile }"
    :flat="isMobile"
    :tile="isMobile"
  >
    <v-toolbar :dense="isMobile" flat>
      <v-breadcrumbs class="pl-0" :items="items">
        <template #divider>
          <v-icon>{{ forwardIcon }}</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <request-help :survey-id="$route.params.surveyId">
        <template v-if="isMobile" #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            color="grey"
            dark
            icon
            small
            :title="$t('common.help.title')"
            v-on="on"
          >
            <v-icon>$info</v-icon>
          </v-btn>
        </template>
      </request-help>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { MealState, Selection } from '@intake24/common/types';
import { RequestHelp } from '@intake24/survey/components';
import { useFoodUtils, useMealUtils } from '@intake24/survey/composables';
import { findFood, findMeal, getFoodIndexRequired } from '@intake24/survey/util';
import { useLocale } from '@intake24/ui';

export type BreadcrumbsElement = {
  text: string;
  disabled: boolean;
};

export default defineComponent({
  name: 'Breadcrumbs',

  components: { RequestHelp },

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

  setup() {
    const { getLocaleContent } = useLocale();
    const { getFoodName } = useFoodUtils();
    const { getMealName, getMealNameWithTime } = useMealUtils();

    const forwardIcon = ref('fas fa-caret-right');

    return { forwardIcon, getFoodName, getLocaleContent, getMealName, getMealNameWithTime };
  },

  computed: {
    items() {
      // return this.getBreadCrumbs;
      return this.getBreadCrumbs.filter((el) => !el.disabled);
    },

    getBreadCrumbs(): BreadcrumbsElement[] {
      const elements: BreadcrumbsElement[] = [];

      const mealElement = this.getMealElement();
      const foodElement = this.getFoodElement();
      const promptElement = { text: this.promptName, disabled: false };

      elements.push(
        mealElement ?? { text: this.$t('breadcrumbs.general').toString(), disabled: false }
      );
      if (foodElement) elements.push(foodElement);

      elements.push(promptElement);

      return elements;
    },
  },

  methods: {
    getMealLabel(meal: MealState, mealTime = true) {
      return mealTime ? this.getMealNameWithTime(meal) : this.getMealName(meal);
    },

    getFoodElement(): BreadcrumbsElement | undefined {
      if (this.selection.element?.type != 'food') return undefined;

      const food = findFood(this.meals, this.selection.element.foodId);
      const text = this.getFoodName(food);

      return { text, disabled: false };
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
</script>

<style lang="scss" scoped>
.v-breadcrumbs {
  li:last-of-type .v-breadcrumbs__item {
    font-weight: 600 !important;
  }
}

.breadcrumbs-mobile {
  position: sticky;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 1;
  //padding-top: 5px;
  border-bottom: 1px solid #cecdcdde;
  overflow-y: hidden;
  white-space: nowrap;
}
</style>
