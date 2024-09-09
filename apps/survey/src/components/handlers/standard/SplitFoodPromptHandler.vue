<template>
  <split-food-prompt
    v-bind="{ food: freeTextFood(), meal, prompt, section, suggestions }"
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

    // TODO: use server-side implementation for split words & lists
    const suggestions = computed(() =>
      freeTextFood()
        .description
        .split(/(?:,| and | with )+/)
        .map(item => item.trim()),
    );

    const single = () => {
      survey.addFoodFlag(freeTextFood().id, 'split-food-complete');
      emit('action', 'next');
    };

    const separate = () => {
      const foodId = freeTextFood().id;
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
      if (suggestions.value.length === 1)
        single();
    });

    return { action, freeTextFood, meal, separate, single, suggestions };
  },
});
</script>
