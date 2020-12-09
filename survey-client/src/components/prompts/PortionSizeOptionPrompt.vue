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
import { PortionSizeOptionPromptProps  } from '@common/types/promptProps';
import { portionSizeOptionPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt from './BasePrompt';

export default Vue.extend({
  // For user to select which portion size estimation method they want to use
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => PortionSizeOptionPromptProps,
    },
  },

  data() {
    return {
      ...merge(portionSizeOptionPromptProps, this.props),
      currentValue: 'as-served',
    };
  },

  methods: {
    onSubmit() {
      this.$emit('portion size option answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>