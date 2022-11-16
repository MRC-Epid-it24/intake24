<template>
  <component
    :is="promptComponent"
    :key="promptId"
    v-bind="{ promptComponent, promptProps }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import { SubmitPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'SubmitPromptHandler',

  components: { SubmitPrompt },

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

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    async action(type: string) {
      if (type === 'next') await this.submit();

      this.$emit('action', type);
    },

    async submit() {
      await this.submitRecall();
    },
  },
});
</script>

<style scoped></style>
