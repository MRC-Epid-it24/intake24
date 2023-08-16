<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-bind="{ prompt, section }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
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

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    async action(type: string, ...args: [id?: string, params?: object]) {
      if (type === 'next') await this.submit();

      this.$emit('action', type, ...args);
    },

    async submit() {
      await this.submitRecall();
    },
  },
});
</script>

<style scoped></style>
