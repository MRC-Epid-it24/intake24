<template>
  <meal-gap-prompt v-bind="{ meals, prompt, section }" @action="action" />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { resolveMealGaps } from '@intake24/common/surveys';
import { MealGapPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MealGapPromptHandler',

  components: { MealGapPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-gap-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const survey = useSurvey();

    const meals = resolveMealGaps(survey.meals, props.prompt);

    const commit = () => {
      const [startMeal, endMeal] = meals;

      if (startMeal && endMeal) {
        survey.addMealFlag(startMeal.id, 'no-meals-between');
        return;
      }

      if (startMeal)
        survey.addMealFlag(startMeal.id, 'no-meals-before');
      if (endMeal)
        survey.addMealFlag(endMeal.id, 'no-meals-after');
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next')
        commit();

      emit('action', type, ...args);
    };

    return { action, meals };
  },
});
</script>

<style scoped></style>
