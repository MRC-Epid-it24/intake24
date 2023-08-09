<template>
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
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { FoodState, MealState } from '@intake24/common/types';
import { RequestHelp } from '@intake24/survey/components';
import { useFoodUtils, useMealUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

export type BreadcrumbsElement = {
  text: string;
  disabled: boolean;
};

export default defineComponent({
  name: 'Breadcrumbs',

  components: { RequestHelp },

  props: {
    food: {
      type: Object as PropType<FoodState>,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    promptName: {
      type: String,
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
      return this.getBreadCrumbs.filter((el) => !el.disabled);
    },

    getFoodElement() {
      return this.food ? { text: this.getFoodName(this.food), disabled: false } : undefined;
    },

    getMealElement() {
      return this.meal ? { text: this.getMealLabel(this.meal), disabled: false } : undefined;
    },

    getBreadCrumbs(): BreadcrumbsElement[] {
      const elements: BreadcrumbsElement[] = [];

      const promptElement = { text: this.promptName, disabled: false };

      elements.push(
        this.getMealElement ?? { text: this.$t('recall._').toString(), disabled: false }
      );
      if (this.getFoodElement) elements.push(this.getFoodElement);

      elements.push(promptElement);

      return elements;
    },
  },

  methods: {
    getMealLabel(meal: MealState, mealTime = true) {
      return mealTime ? this.getMealNameWithTime(meal) : this.getMealName(meal);
    },
  },
});
</script>

<style lang="scss">
.v-breadcrumbs {
  li:last-of-type .v-breadcrumbs__item {
    font-weight: 600 !important;
  }
}

/* 
* TODO
* sticky won't work within component and does not trigger correctly when top panel hides -> leave space gap
* - turned into fixed position
* - detect scroll top position and show/hide
*/
.breadcrumbs-mobile {
  position: sticky;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 5;
  border-bottom: 1px solid #cecdcdde;
  //padding-top: 5px;
  overflow-y: hidden;
  white-space: nowrap;
}
</style>
