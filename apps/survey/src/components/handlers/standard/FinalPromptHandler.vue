<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{
      canShowFeedback,
      canRestart,
      prompt,
      surveyId,
    }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { FinalPrompt /*RedirectPrompt*/ } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FinalPromptHandler',

  components: { FinalPrompt /*, RedirectPrompt */ },

  props: {
    prompt: {
      type: Object as PropType<Prompts['final-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup() {
    const { user } = useSurvey();

    const canRestart = ref(
      !user?.maximumDailySubmissionsReached && !user?.maximumTotalSubmissionsReached
    );
    const canShowFeedback = ref(user?.showFeedback);

    return { canRestart, canShowFeedback };
  },

  computed: {
    surveyId(): string {
      return this.$route.params.surveyId;
    },
  },

  methods: {
    action(type: string, id?: string) {
      this.$emit('action', type, id);
    },
  },
});
</script>

<style scoped></style>
