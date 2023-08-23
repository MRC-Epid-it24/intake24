<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{
      followUpUrl,
      showFeedback,
      prompt,
      section,
      surveyId,
    }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { RedirectPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'RedirectPromptHandler',

  components: { RedirectPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['redirect-prompt']>,
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

    const showFeedback = computed(() => survey.user?.showFeedback);
    const followUpUrl = computed(() => survey.user?.followUpUrl);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      emit('action', type, ...args);
    };

    return { action, followUpUrl, showFeedback };
  },

  computed: {
    surveyId(): string {
      return this.$route.params.surveyId;
    },
  },
});
</script>

<style scoped></style>
