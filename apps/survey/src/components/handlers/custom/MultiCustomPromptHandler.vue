<template>
  <multi-prompt
    v-model="state"
    v-bind="{
      meal: mealOptional,
      food: foodOptional,
      prompt,
      section,
    }"
    @action="action"
  ></multi-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { CustomPromptAnswer } from '@intake24/common/types';
import { MultiPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useCustomPromptHandler } from '../mixins';

const infoPrompts = ['info-prompt'];

export default defineComponent({
  name: 'MultiCustomPromptHandler',

  components: { MultiPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['multi-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { commitPromptAnswer, foodOptional, getPromptAnswer, mealOptional } =
      useCustomPromptHandler(props);
    const survey = useSurvey();

    const isInfoPrompt = (prompt: Prompt) => infoPrompts.includes(prompt.component);
    const state = ref<(CustomPromptAnswer | undefined)[]>(
      props.prompt.prompts.map((prompt) =>
        isInfoPrompt(prompt) ? 'next' : getPromptAnswer(prompt.id)
      )
    );

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitAnswer();

      emit('action', type, ...args);
    };

    const commitAnswer = () => {
      if (state.value.some((answer) => answer === undefined)) {
        console.warn('Did not expect answer to be undefined');
        return;
      }

      props.prompt.prompts.forEach((prompt, idx) => {
        commitPromptAnswer(prompt, state.value[idx]);
      });
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
