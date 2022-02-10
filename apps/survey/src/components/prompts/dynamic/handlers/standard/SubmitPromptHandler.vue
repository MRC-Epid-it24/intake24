<template>
  <component :is="promptComponent" v-bind="{ promptProps }" @submit="submit"></component>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import SubmitPrompt from '@intake24/survey/components/prompts/standard/SubmitPrompt.vue';

export default defineComponent({
  name: 'SubmitPromptHandler',

  components: { SubmitPrompt },

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
    async submit() {
      await this.$store.dispatch('survey/submitRecall');
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
