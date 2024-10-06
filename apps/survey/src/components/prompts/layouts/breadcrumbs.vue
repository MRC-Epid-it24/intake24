<template>
  <v-toolbar class="px-4" color="white" :dense="$vuetify.display.mobile" flat>
    <v-breadcrumbs class="ps-0 text-body-2" :items="items">
      <template #divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
    <v-spacer />
    <request-help :survey-id="$route.params.surveyId">
      <template v-if="$vuetify.display.mobile" #activator="{ props }">
        <v-btn
          v-bind="props"
          color="grey"
          icon
          size="small"
          :title="$t('common.help.title')"
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
import { useFoodUtils, useMealUtils } from '@intake24/survey/composables';

import { RequestHelp } from '../../elements';

export type BreadcrumbsElement = {
  title: string;
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
    const { getFoodName } = useFoodUtils();
    const { getMealName, getMealNameWithTime } = useMealUtils();

    const forwardIcon = ref('fas fa-caret-right');

    return { forwardIcon, getFoodName, getMealName, getMealNameWithTime };
  },

  computed: {
    items() {
      return this.getBreadCrumbs.filter(el => !el.disabled);
    },

    getFoodElement() {
      return this.food ? { title: this.getFoodName(this.food), disabled: false } : undefined;
    },

    getMealElement() {
      return this.meal ? { title: this.getMealLabel(this.meal), disabled: false } : undefined;
    },

    getBreadCrumbs(): BreadcrumbsElement[] {
      const elements: BreadcrumbsElement[] = [];

      const promptElement = { title: this.promptName, disabled: false };

      elements.push(
        this.getMealElement ?? { title: this.$t('recall._'), disabled: false },
      );
      if (this.getFoodElement)
        elements.push(this.getFoodElement);

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
  .v-breadcrumbs-item:last-of-type {
    font-weight: 600;
  }
}
</style>
