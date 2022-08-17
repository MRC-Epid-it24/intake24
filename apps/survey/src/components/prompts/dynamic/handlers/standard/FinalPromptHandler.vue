<template>
  <component
    :is="promptComponent"
    v-bind="{ canShowFeedback, canRestart, promptProps, surveyId }"
    @restart="restart"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import FinalPrompt from '@intake24/survey/components/prompts/standard/FinalPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
// import RedirectPrompt from '@intake24/survey/components/prompts/standard/RedirectPrompt.vue';

export default defineComponent({
  name: 'FinalPromptHandler',

  components: { FinalPrompt /*, RedirectPrompt */ },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
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
    async restart() {
      this.$emit('restart');
    },
  },
});
</script>

<style scoped></style>
