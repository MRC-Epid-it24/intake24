<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #prompt-description>
      <div class="px-4 pt-4" :class="{ 'pb-4': isMobile }" v-html="promptI18n.description"></div>
    </template>
    <template #actions>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="promptI18n.yes"
        @click.stop="action('addMeal')"
      >
        <v-icon left>$add</v-icon>
        {{ promptI18n.yes }}
      </v-btn>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="promptI18n.no"
        @click.stop="action('next')"
      >
        <v-icon left>$next</v-icon>
        {{ promptI18n.no }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="promptI18n.yes" value="addMeal" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn :title="promptI18n.no" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useMealUtils, usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealGapPrompt',

  mixins: [createBasePrompt<'meal-gap-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<(MealState | undefined)[]>,
      default: () => [],
    },
  },

  setup(props) {
    const { i18n } = useI18n();
    const { translatePrompt, type } = usePromptUtils(props);
    const { getMealName, getMealTime } = useMealUtils();

    const description = computed(() => {
      const [startMeal, endMeal] = props.meals;

      if (startMeal && endMeal)
        return i18n.t(`prompts.${type.value}.between`, {
          startMeal: getMealName(startMeal),
          startMealTime: getMealTime(startMeal) ?? '',
          endMeal: getMealName(endMeal),
          endMealTime: getMealTime(endMeal) ?? '',
        });

      if (startMeal)
        return i18n.t(`prompts.${type.value}.before`, {
          meal: getMealName(startMeal),
          mealTime: getMealTime(startMeal) ?? '',
        });

      if (endMeal)
        return i18n.t(`prompts.${type.value}.after`, {
          meal: getMealName(endMeal),
          mealTime: getMealTime(endMeal) ?? '',
        });

      return '';
    });

    const promptI18n = computed(() => ({
      ...translatePrompt(['yes', 'no']),
      description: description.value,
    }));

    const isValid = computed(() => true);

    return { promptI18n, isValid, getMealName, getMealTime };
  },
});
</script>

<style lang="scss" scoped></style>
