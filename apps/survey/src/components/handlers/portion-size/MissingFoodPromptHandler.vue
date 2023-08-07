<template>
  <missing-food-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      prompt,
    }"
    @action="action"
    @update="update"
  ></missing-food-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { MissingFoodPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'MissingFoodPromptHandler',

  components: { MissingFoodPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['missing-food-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const survey = useSurvey();
    const { missingFood: food } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['missing-food-prompt'] => ({
      info: food().info ?? {
        name: food().searchTerm,
        brand: null,
        description: null,
        leftovers: null,
        portionSize: null,
      },
      panel: 0,
      homemadePrompt: undefined,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(props, getInitialState);

    const commitAnswer = () => {
      const { info } = state.value;

      survey.updateFood({ foodId: food().id, update: { info } });
      survey.addFoodFlag(food().id, 'missing-food-complete');

      clearStoredState();
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitAnswer();

      emit('action', type, ...args);
    };

    return { food, meal, state, update, action };
  },
});
</script>
