<template>
  <split-food-prompt
    v-bind="{ food, meal, prompt, section, suggestions }"
    @action="action"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { SplitFoodPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { getEntityId, getFoodIndexRequired } from '@intake24/survey/util';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils } from '../composables';

defineProps(createHandlerProps<'split-food-prompt'>());

const emit = defineEmits(['action']);

const { freeTextFood, meals } = useFoodPromptUtils();
const { meal } = useMealPromptUtils();
const survey = useSurvey();

const food = freeTextFood.value;

/* Temporary solution to V3 split lists
*  TODO: server-side implementation for
* - split words & lists
* - force-split exception lists
*/
const suggestions = computed(() =>
  food
    .description
    .split(/(?:,|&| and | with )+/i)
    .map(item => item.trim()),
);

const forceSplits = ['burger:chips', 'chips:fish'];

const forceSplit = computed(() => {
  const check = [...suggestions.value].sort((a, b) => a.localeCompare(b)).join(':').toLowerCase();
  return forceSplits.includes(check);
});

function single() {
  survey.addFoodFlag(food.id, 'split-food-complete');
  emit('action', 'next');
}

function separate() {
  const foodId = food.id;
  const { foodIndex } = getFoodIndexRequired(meals.value, foodId);

  const [first, ...rest] = suggestions.value;

  rest.forEach((suggestion, idx) => {
    survey.addFood({
      mealId: meal.value.id,
      food: {
        id: getEntityId(),
        type: 'free-text',
        description: suggestion,
        flags: ['split-food-complete'],
        customPromptAnswers: {},
        linkedFoods: [],
      },
      at: foodIndex + (idx + 1),
    });
  });

  survey.updateFood({ foodId, update: { description: first } });
  survey.addFoodFlag(foodId, 'split-food-complete');
  emit('action', 'next');
}

const splitActions = { single, separate };

function action(type: string, ...args: [id?: string, params?: object]) {
  if (['single', 'separate'].includes(type)) {
    splitActions[type as 'single' | 'separate']();
    return;
  }

  emit('action', type, ...args);
}

onMounted(() => {
  if (forceSplit.value) {
    separate();
    return;
  }

  if (suggestions.value.length === 1)
    single();
});
</script>
