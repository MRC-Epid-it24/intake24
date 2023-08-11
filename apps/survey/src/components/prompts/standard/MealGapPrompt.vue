<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <template #prompt-description>
      <div class="px-4 pt-4" :class="{ 'pb-4': isMobile }" v-html="i18n.description"></div>
    </template>
    <template #actions>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="i18n.yes"
        @click.stop="action('addMeal')"
      >
        <v-icon left>$add</v-icon>
        {{ i18n.yes }}
      </v-btn>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="i18n.no"
        @click.stop="action('next')"
      >
        <v-icon left>$next</v-icon>
        {{ i18n.no }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="i18n.yes" value="addMeal" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ i18n.yes }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn :title="i18n.no" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ i18n.no }}
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
    const { translate } = useI18n();
    const { translatePrompt, type } = usePromptUtils(props);
    const { getMealName, getMealTime } = useMealUtils();

    const description = computed(() => {
      const [startMeal, endMeal] = props.meals;

      if (startMeal && endMeal)
        return translate(props.prompt.i18n.both, {
          path: `prompts.${type.value}.between`,
          params: {
            startMeal: getMealName(startMeal),
            startMealTime: getMealTime(startMeal) ?? '',
            endMeal: getMealName(endMeal),
            endMealTime: getMealTime(endMeal) ?? '',
          },
          sanitize: true,
        });

      if (startMeal)
        return translate(props.prompt.i18n.before, {
          path: `prompts.${type.value}.before`,
          params: {
            meal: getMealName(startMeal),
            mealTime: getMealTime(startMeal) ?? '',
          },
          sanitize: true,
        });

      if (endMeal)
        return translate(props.prompt.i18n.after, {
          path: `prompts.${type.value}.after`,
          params: { meal: getMealName(endMeal), mealTime: getMealTime(endMeal) ?? '' },
          sanitize: true,
        });

      return '';
    });

    const i18n = computed(() => ({
      ...translatePrompt(['yes', 'no']),
      description: description.value,
    }));

    const isValid = computed(() => true);

    return { i18n, isValid, translate, getMealName, getMealTime };
  },
});
</script>

<style lang="scss" scoped></style>
