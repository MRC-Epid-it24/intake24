<template>
  <ready-meal-prompt
    v-bind="{ initialState: state, meal, prompt, section }"
    @action="action"
    @update="update"
  ></ready-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

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

  setup(props, context) {
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const alreadyAnswered = computed(() => meal.value.flags.includes('ready-meal-complete'));

    const getInitialState = computed(() => ({
      foods: (
        meal.value.foods.filter(
          (food) => food.type === 'encoded-food' && food.data.readyMealOption
        ) as EncodedFood[]
      ).map((food) => ({
        id: food.id,
        name: food.data.localName,
        value: alreadyAnswered.value ? food.flags.includes('ready-meal') : undefined,
      })),
    }));

    const { state, update } = usePromptHandlerNoStore(getInitialState);

    const commitAnswer = () => {
      for (const food of state.value.foods) {
        survey.setFoodFlag(food.id, 'ready-meal', !!food.value);
      }

      survey.addMealFlag(meal.value.id, 'ready-meal-complete');
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitAnswer();

      context.emit('action', type, ...args);
    };

    if (!state.value.foods.length) action('next');

    return { meal, state, update, action };
  },
});
</script>

<style scoped></style>
