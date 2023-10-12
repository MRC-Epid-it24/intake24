<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{ meals, prompt, section }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { SubmitPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'SubmitPromptHandler',

  components: { SubmitPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['submit-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const survey = useSurvey();

    const action = async (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') await survey.submitRecall();

      emit('action', type, ...args);
    };

    return { action, meals: survey.meals };
  },
});
</script>

<style scoped></style>
