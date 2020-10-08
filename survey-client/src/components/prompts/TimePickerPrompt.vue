<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-time-picker
          v-model="currentValue"
          format="24hr"
          :landscape="!isMobile"
          full-width
          @input="clearErrors"
        ></v-time-picker>
        <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { TimePickerPromptProps } from '@common/types/promptProps';
import { timePickerPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt, { Prompt } from './BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'TimePickerPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => TimePickerPromptProps,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(timePickerPromptProps, this.props),
      currentValue: this.value,
      errors: [] as string[],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    onSubmit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('prompts.timepicker.validation.required') as string),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
