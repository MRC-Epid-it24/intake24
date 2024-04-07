<template>
  <missing-food-prompt
    v-model="state"
    v-bind="{
      food: food(),
      meal,
      prompt,
      section,
    }"
    @action="action"
    @input="update"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
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
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
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

    const commitAnswer = () => {
      const { info } = state.value;

      survey.updateFood({ foodId: food().id, update: { info } });
      survey.addFoodFlag(food().id, 'missing-food-complete');

      clearStoredState();
    };

    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState,
      commitAnswer,
    );

    return { food, meal, state, action, update };
  },
});
</script>
