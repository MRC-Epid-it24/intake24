<template>
  <recipe-builder-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      prompt,
    }"
    @action="action"
    @update="update"
  ></recipe-builder-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { RecipeBuilderPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'RecipeBuilderPromptHandler',

  components: { RecipeBuilderPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['recipe-builder-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const survey = useSurvey();
    const { recipeBuilder: food } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['recipe-builder-prompt'] => ({
      panel: 0,
      finishedSteps: [],
      steps: [],
    });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    const commitAnswer = () => {
      const { steps } = state.value;

      // if (['name', 'description', 'portionSize'].some((key) => !info[key as keyof typeof info]))
      //   throw new Error('Recipe Builder food prompt: missing data');

      // survey.updateFood({ foodId: food().id, update: { info } });
      survey.addFoodFlag(food().id, 'recipe-builder-complete');

      clearStoredState();
    };

    const action = (type: string, id?: string) => {
      if (type === 'next') commitAnswer();

      emit('action', type, id);
    };

    return { food, meal, state, update, action };
  },
});
</script>
