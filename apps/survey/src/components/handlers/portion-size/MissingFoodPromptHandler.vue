<template>
  <missing-food-prompt
    v-bind="{
      food: food(),
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

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

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

    const getInitialState = (): PromptStates['missing-food-prompt'] => ({
      info: food().info ?? {
        name: food().searchTerm,
        brand: '',
        description: '',
        leftovers: '',
        portionSize: '',
      },
      panel: 0,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    const commitAnswer = () => {
      const { info } = state.value;

      if (Object.values(info).some((value) => !value))
        throw new Error('Missing food prompt: missing data');

      survey.updateFood({ foodId: food().id, update: { info } });
      survey.addFoodFlag({ foodId: food().id, flag: 'missing-food-complete' });

      clearStoredState();
    };

    const action = (type: string, id?: string) => {
      if (type === 'next') commitAnswer();

      emit('action', type, id);
    };

    return { food, state, update, action };
  },
});
</script>
