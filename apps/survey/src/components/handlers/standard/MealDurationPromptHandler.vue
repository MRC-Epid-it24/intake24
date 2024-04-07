<template>
  <meal-duration-prompt
    v-model="state"
    v-bind="{ meal, prompt, section }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { MealDurationPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealDurationPromptHandler',

  components: { MealDurationPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-duration-prompt']>,
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

    const getInitialState = computed(
      () => props.prompt.slider.current.value || props.prompt.slider.min.value || 0,
    );

    const commitAnswer = () => {
      survey.setMealDuration(meal.value.id, state.value);
    };

    const { state, action } = usePromptHandlerNoStore(ctx, getInitialState, commitAnswer);

    return { meal, state, action };
  },
});
</script>

<style scoped></style>
