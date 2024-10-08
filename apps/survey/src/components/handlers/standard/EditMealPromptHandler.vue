<template>
  <edit-meal-prompt
    v-model="state"
    v-bind="{ meal, prompt, section }"
    @action="action"
    @update:model-value="update"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { EditMealPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'EditMealPromptHandler',

  components: { EditMealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['edit-meal-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const getInitialState = (): PromptStates['edit-meal-prompt'] => meal.value.foods;

    const commitAnswer = () => {
      const mealId = meal.value.id;

      survey.setFoods({ mealId, foods: state.value });
      survey.addMealFlag(mealId, 'free-entry-complete');

      clearStoredState();
    };

    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState,
      commitAnswer,
    );

    return {
      meal,
      state,
      action,
      update,
    };
  },
});
</script>
