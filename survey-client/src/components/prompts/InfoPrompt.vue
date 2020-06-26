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
import Vue, { PropType } from 'vue';
import merge from 'deepmerge';
import { BasePromptProps } from '@common/types/promptProps';
import BasePrompt from './BasePrompt';
import { baseDefaults } from './promptDefaults';

export default Vue.extend({
  name: 'InfoPage',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<BasePromptProps>,
    },
  },

  data() {
    return {
      ...merge(baseDefaults, this.props),
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
