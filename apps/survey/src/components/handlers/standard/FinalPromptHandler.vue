<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{
      feedbackAvailable,
      feedbackEnabled,
      prompt,
      section,
      submissionId,
      surveyId,
    }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router/composables';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { FinalPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FinalPromptHandler',

  components: { FinalPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['final-prompt']>,
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
    const route = useRoute();

    const feedbackAvailable = computed(() => survey.feedbackAvailable);
    const feedbackEnabled = computed(() => survey.feedbackEnabled);
    const submissionId = computed(() => survey.data.id);
    const surveyId = computed(() => route.params.surveyId);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      emit('action', type, ...args);
    };

    return { action, feedbackAvailable, feedbackEnabled, submissionId, surveyId };
  },
});
</script>

<style scoped></style>
