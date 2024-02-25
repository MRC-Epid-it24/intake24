<template>
  <ready-meal-prompt
    v-if="state.length"
    v-model="state"
    v-bind="{ meal, prompt, section }"
    @action="action"
  ></ready-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood } from '@intake24/common/types';
import { ReadyMealPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'ReadyMealPromptHandler',

  components: { ReadyMealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['ready-meal-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const alreadyAnswered = computed(() => meal.value.flags.includes('ready-meal-complete'));

    const getInitialState = computed(() =>
      (
        meal.value.foods.filter(
          (food) => food.type === 'encoded-food' && food.data.readyMealOption
        ) as EncodedFood[]
      ).map((food) => ({
        id: food.id,
        name: food.data.localName,
        value: alreadyAnswered.value ? food.flags.includes('ready-meal') : undefined,
      }))
    );

    const commitAnswer = () => {
      for (const food of state.value) {
        survey.setFoodFlag(food.id, 'ready-meal', !!food.value);
      }

      survey.addMealFlag(meal.value.id, 'ready-meal-complete');
    };

    const { state, action } = usePromptHandlerNoStore(ctx, getInitialState, commitAnswer);

    onMounted(() => {
      if (!state.value.length) action('next');
    });

    return { meal, state, action };
  },
});
</script>

<style scoped></style>
