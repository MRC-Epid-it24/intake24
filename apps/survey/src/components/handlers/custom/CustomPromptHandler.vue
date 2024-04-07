<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-model="state"
    v-bind="{
      meal: mealOptional,
      food: foodOptional,
      prompt,
      section,
    }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { CustomPromptAnswer } from '@intake24/common/types';
import { customPrompts } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useCustomPromptHandler } from '../mixins';

const infoPrompts = ['info-prompt'];

export default defineComponent({
  name: 'CustomPromptHandler',

  components: { ...customPrompts },

  props: {
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { commitPromptAnswer, getPromptAnswer, foodOptional, mealOptional }
      = useCustomPromptHandler(props);
    const survey = useSurvey();

    const isInfoPrompt = computed(() => infoPrompts.includes(props.prompt.component));
    const state = ref<CustomPromptAnswer | undefined>(
      isInfoPrompt.value ? 'next' : getPromptAnswer(props.prompt.id),
    );

    const commitAnswer = () => {
      if (props.prompt.component === 'no-more-information-prompt') {
        const newSelection = survey.selection;
        newSelection.mode = 'auto';
        survey.setSelection(newSelection);
      }

      commitPromptAnswer(props.prompt, state.value);
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next' || isInfoPrompt.value)
        commitAnswer();

      emit('action', type, ...args);
    };

    return {
      action,
      foodOptional,
      mealOptional,
      state,
      survey,
    };
  },
});
</script>

<style scoped></style>
