<template>
  <component
    :is="promptComponent"
    :key="promptId"
    v-bind="{ promptProps }"
    @submit="submit"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { SubmitPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'SubmitPromptHandler',

  components: { SubmitPrompt },

  props: {
    promptComponent: {
      type: String,
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

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    async submit() {
      await this.submitRecall();
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
