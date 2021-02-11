<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-date-picker
          v-model="currentValue"
          :landscape="!isMobile"
          full-width
          @input="clearErrors"
        ></v-date-picker>
        <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { DatePickerPromptProps } from '@common/types';
import { datePickerPromptProps } from '@common/defaults';
import BasePrompt, { Prompt } from './BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'DatePickerPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => DatePickerPromptProps,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(datePickerPromptProps, this.props),
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
            (this.$t('prompts.datepicker.validation.required') as string),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
