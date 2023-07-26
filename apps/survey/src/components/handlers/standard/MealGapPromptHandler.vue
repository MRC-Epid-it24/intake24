<template>
  <meal-gap-prompt v-bind="{ meals, prompt }" @action="action"></meal-gap-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { MealGapPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { resolveMealGaps } from '@intake24/ui/util';

export default defineComponent({
  name: 'MealGapPromptHandler',

  components: { MealGapPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-gap-prompt']>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const survey = useSurvey();

    const meals = resolveMealGaps(survey.meals, props.prompt);

    const commit = () => {
      const [startMeal, endMeal] = meals;

      if (startMeal && endMeal) {
        survey.addMealFlag(startMeal.id, 'no-meals-between');
        return;
      }

      if (startMeal) survey.addMealFlag(startMeal.id, 'no-meals-before');
      if (endMeal) survey.addMealFlag(endMeal.id, 'no-meals-after');
    };

    const action = async (type: 'addMeal' | 'next') => {
      if (type === 'next') commit();

      emit('action', type);
    };

    return { action, meals };
  },
});
</script>

<style scoped></style>
