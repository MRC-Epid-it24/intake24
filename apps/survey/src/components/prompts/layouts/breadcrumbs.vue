<template>
  <v-toolbar class="px-4" color="white" :density="$vuetify.display.mobile ? 'compact' : 'default'">
    <v-breadcrumbs class="ps-0 text-body-2" :items="items">
      <template #divider>
        <v-icon>fas fa-caret-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-spacer />
    <request-help :survey-id="$route.params.surveyId.toString()">
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
import { computed, defineComponent } from 'vue';

import type { FoodState, MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';

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

  setup(props) {
    const { i18n: { t } } = useI18n();
    const { getFoodName } = useFoodUtils();
    const { getMealName, getMealNameWithTime } = useMealUtils();

    const getMealLabel = (meal: MealState, mealTime = true) => {
      return mealTime && !meal.flags.includes('meal-time:hidden') ? getMealNameWithTime(meal) : getMealName(meal);
    };

    const foodElement = computed(() => props.food ? { title: getFoodName(props.food), disabled: false } : undefined);
    const mealElement = computed(() => props.meal ? { title: getMealLabel(props.meal), disabled: false } : undefined);
    const breadCrumbs = computed(() => {
      const elements: BreadcrumbsElement[] = [];

      const promptElement = { title: props.promptName, disabled: false };

      elements.push(
        mealElement.value ?? { title: t('recall._'), disabled: false },
      );
      if (foodElement.value)
        elements.push(foodElement.value);

      elements.push(promptElement);

      return elements;
    });
    const items = computed(() => breadCrumbs.value.filter(el => !el.disabled));

    return { items };
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
