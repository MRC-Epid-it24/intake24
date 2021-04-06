<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="submit">
        <submit></submit>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { BasePromptProps, submitPromptProps } from '@common/prompts';
import Submit from '@/components/Submit.vue';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'SubmitPrompt',

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
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
