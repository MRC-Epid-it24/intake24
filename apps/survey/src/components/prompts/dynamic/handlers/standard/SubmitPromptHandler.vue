<template>
  <component :is="promptComponent" v-bind="{ promptProps }" @submit="submit"></component>
</template>

<script lang="ts">
import Vue from 'vue';
import { BasePromptProps } from '@common/prompts';
import SubmitPrompt from '@/components/prompts/standard/SubmitPrompt.vue';

export default Vue.extend({
  name: 'SubmitPromptHandler',

  components: { SubmitPrompt },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  methods: {
    async submit() {
      await this.$store.dispatch('survey/submitRecall');
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
