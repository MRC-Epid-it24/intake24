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
import Vue, { PropType, VueConstructor } from 'vue';
import merge from 'deepmerge';
import { DatePickerProps, PromptRefs } from '@/types/prompts';
import BasePrompt from './BasePrompt';
import { datePickerDefaults } from './promptDefaults';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
  name: 'DatePickerPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<DatePickerProps>,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(datePickerDefaults, this.props),
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
        this.errors = [this.validation.message];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
