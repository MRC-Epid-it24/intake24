<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { BasePromptProps, infoPromptProps } from '@common/prompts';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'InfoPage',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => BasePromptProps,
    },
  },

  data() {
    return {
      ...merge(infoPromptProps, this.props),
      currentValue: 'ok',
    };
  },

  methods: {
    onSubmit() {
      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
