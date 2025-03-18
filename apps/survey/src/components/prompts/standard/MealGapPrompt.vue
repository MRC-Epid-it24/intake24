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
        <v-icon icon="$add" start />
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
        <v-icon icon="$next" start />
        {{ promptI18n.no }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="promptI18n.yes" variant="text" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1" icon="$add" />
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" :title="promptI18n.no" variant="text" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1" icon="$next" />
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { MealState } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';
import { useMealUtils, usePromptUtils } from '@intake24/survey/composables';
import { CardLayout } from '../layouts';
import { createBasePromptProps } from '../prompt-props';

const props = defineProps({
  ...createBasePromptProps<'meal-gap-prompt'>(),
  meals: {
    type: Array as PropType<(MealState | undefined)[]>,
    default: () => [],
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { i18n: { t } } = useI18n();
const { action, translatePrompt, type } = usePromptUtils(props, { emit });
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
</script>

<style lang="scss" scoped></style>
