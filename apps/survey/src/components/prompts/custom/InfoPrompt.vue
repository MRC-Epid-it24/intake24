<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { merge } from '@common/util';
import { BasePromptProps, infoPromptProps } from '@common/prompts';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'InfoPage',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  data() {
    return {
      ...merge(infoPromptProps, this.promptProps),
      currentValue: null,
    };
  },

  methods: {
    submit() {
      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
