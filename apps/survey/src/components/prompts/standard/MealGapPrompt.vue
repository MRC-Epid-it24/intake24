<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #prompt-description>
      <div class="px-4 pt-4" :class="{ 'pb-4': $vuetify.display.mobile }" v-html="promptI18n.description" />
    </template>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.yes"
        variant="text"
        @click.stop="action('addMeal')"
      >
        <v-icon start>
          $add
        </v-icon>
        {{ promptI18n.yes }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.no"
        variant="text"
        @click.stop="action('next')"
      >
        <v-icon start>
          $next
        </v-icon>
        {{ promptI18n.no }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="promptI18n.yes" variant="text" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1">
          $add
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" :title="promptI18n.no" variant="text" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">
          $next
        </v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { MealState } from '@intake24/common/surveys';
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

  setup(props, ctx) {
    const { i18n: { t } } = useI18n();
    const { action, translatePrompt, type } = usePromptUtils(props, ctx);
    const { getMealName, getMealTime } = useMealUtils();

    const description = computed(() => {
      const [startMeal, endMeal] = props.meals;

      if (startMeal && endMeal) {
        return t(`prompts.${type.value}.between`, {
          startMeal: getMealName(startMeal),
          startMealTime: getMealTime(startMeal) ?? '',
          endMeal: getMealName(endMeal),
          endMealTime: getMealTime(endMeal) ?? '',
        });
      }

      if (startMeal) {
        return t(`prompts.${type.value}.before`, {
          meal: getMealName(startMeal),
          mealTime: getMealTime(startMeal) ?? '',
        });
      }

      if (endMeal) {
        return t(`prompts.${type.value}.after`, {
          meal: getMealName(endMeal),
          mealTime: getMealTime(endMeal) ?? '',
        });
      }

      return '';
    });

    const isValid = true;
    const promptI18n = computed(() => ({
      ...translatePrompt(['yes', 'no']),
      description: description.value,
    }));

    return { action, isValid, promptI18n, getMealName, getMealTime };
  },
});
</script>

<style lang="scss" scoped></style>
