<template>
  <prompt-layout :text="promptTitle" :description="promptProps.description">
    <template v-slot:actions>
      <submit @click.native="submit"></submit>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { BasePromptProps, submitPromptProps } from '@common/prompts';
import Submit from '@/components/prompts/actions/Submit.vue';
import { LocaleTranslation } from '@common/types';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'FoodSearchPrompt',

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
    initialSearchTerm: {
      type: String,
    },
  },

  computed: {
    promptTitle(): LocaleTranslation {
      return Object.fromEntries(
        Object.entries(this.promptProps.text).map((value) => [
          value[0],
          value[1]?.replace('{searchTerm}', this.searchTerm),
        ])
      );
    },
  },

  data() {
    return {
      ...merge(submitPromptProps, this.promptProps),
      searchTerm: () => this.initialSearchTerm,
    };
  },

  methods: {
    submit() {
      this.$emit('foodSelected');
    },
  },
});
</script>

<style lang="scss" scoped></style>
