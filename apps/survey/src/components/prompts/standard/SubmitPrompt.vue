<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <submit @click.native="submit"></submit>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import { BasePromptProps, submitPromptProps } from '@intake24/common/prompts';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return { ...merge(submitPromptProps, this.promptProps) };
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
