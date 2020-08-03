<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-date-picker
          v-model="currentValue"
          :landscape="$vuetify.breakpoint.smAndUp"
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
import { PromptRefs } from '@common/types/prompts';
import { DatePickerPromptProps } from '@common/types/promptProps';
import { datePickerPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt from './BasePrompt';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
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
          this.validation.message[this.$i18n.locale] ??
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
