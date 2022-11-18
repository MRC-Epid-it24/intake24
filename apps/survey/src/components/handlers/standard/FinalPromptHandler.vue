<template>
  <component
    :is="promptComponent"
    :key="promptId"
    v-bind="{
      canShowFeedback,
      canRestart,
      promptComponent,
      promptProps,
      surveyId,
    }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import { FinalPrompt /*RedirectPrompt*/ } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FinalPromptHandler',

  components: { FinalPrompt /*, RedirectPrompt */ },

  props: {
    promptComponent: {
      type: String as PropType<StandardComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

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
    action(type: string, id?: number) {
      this.$emit('action', type, id);
    },
  },
});
</script>

<style scoped></style>
