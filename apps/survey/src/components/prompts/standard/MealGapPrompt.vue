<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <template #prompt-description>
      <div class="px-4 pt-4" :class="{ 'pb-4': isMobile }" v-html="description"></div>
    </template>
    <template #actions>
      <v-btn class="px-4" color="secondary" large text @click.stop="action('addMeal')">
        <v-icon left>$add</v-icon>
        {{ $t(`prompts.${type}.yes`) }}
      </v-btn>
      <v-btn class="px-4" color="secondary" large text @click.stop="action('next')">
        <v-icon left>$next</v-icon>
        {{ $t(`prompts.${type}.no`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="addMeal" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.yes`) }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.no`) }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useMealUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

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

  setup() {
    const { getLocaleContent } = useLocale();
    const { getMealName, getMealTime } = useMealUtils();

    return { getLocaleContent, getMealName, getMealTime };
  },

  computed: {
    description(): string {
      const [startMeal, endMeal] = this.meals;

      if (startMeal && endMeal)
        return this.getLocaleContent(this.prompt.i18n.both, {
          path: `prompts.${this.type}.between`,
          params: {
            startMeal: this.getMealName(startMeal),
            startMealTime: this.getMealTime(startMeal) ?? '',
            endMeal: this.getMealName(endMeal),
            endMealTime: this.getMealTime(endMeal) ?? '',
          },
          sanitize: true,
        });

      if (startMeal)
        return this.getLocaleContent(this.prompt.i18n.before, {
          path: `prompts.${this.type}.before`,
          params: {
            meal: this.getMealName(startMeal),
            mealTime: this.getMealTime(startMeal) ?? '',
          },
          sanitize: true,
        });

      if (endMeal)
        return this.getLocaleContent(this.prompt.i18n.after, {
          path: `prompts.${this.type}.after`,
          params: { meal: this.getMealName(endMeal), mealTime: this.getMealTime(endMeal) ?? '' },
          sanitize: true,
        });

      return '';
    },

    isValid(): boolean {
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
