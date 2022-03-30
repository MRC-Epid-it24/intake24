<template>
  <review-confirm-prompt
    :prompt-props="promptProps"
    :prompt-component="promptComponent"
  ></review-confirm-prompt>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import ReviewConfirmPrompt from '@intake24/survey/components/prompts/standard/ReviewConfirmPrompt.vue';
import { mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'ReviewConfirmPromptHandler',

  components: { ReviewConfirmPrompt },

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
