<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{
      showFeedback,
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
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { user } = useSurvey();

    const showFeedback = ref(user?.showFeedback);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      emit('action', type, ...args);
    };

    return { action, showFeedback };
  },

  computed: {
    surveyId(): string {
      return this.$route.params.surveyId;
    },
  },
});
</script>

<style scoped></style>
