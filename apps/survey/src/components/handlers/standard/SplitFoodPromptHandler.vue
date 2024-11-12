<template>
  <split-food-prompt
    v-bind="{ food, meal, prompt, section, suggestions }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { SplitFoodPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { getEntityId, getFoodIndexRequired } from '@intake24/survey/util';

import { useFoodPromptUtils, useMealPromptUtils } from '../mixins';

export default defineComponent({
  name: 'SplitFoodPromptHandler',

  components: { SplitFoodPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['split-food-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { freeTextFood, meals } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const food = freeTextFood();

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

    const single = () => {
      survey.addFoodFlag(food.id, 'split-food-complete');
      emit('action', 'next');
    };

    const separate = () => {
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
    };

    const splitActions = { single, separate };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (['single', 'separate'].includes(type)) {
        splitActions[type as 'single' | 'separate']();
        return;
      }

      emit('action', type, ...args);
    };

    onMounted(() => {
      if (forceSplit.value) {
        separate();
        return;
      }

      if (suggestions.value.length === 1)
        single();
    });

    return { action, food, meal, separate, single, suggestions };
  },
});
</script>
