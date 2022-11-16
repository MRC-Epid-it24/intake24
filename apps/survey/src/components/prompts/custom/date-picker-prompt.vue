<template>
  <prompt-layout v-bind="{ actions, description, text, meal, food, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-date-picker
        v-model="currentValue"
        full-width
        :landscape="!isMobile"
        @input="update"
      ></v-date-picker>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { DatePickerPromptProps } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'DatePickerPrompt',

  mixins: [createBasePrompt<DatePickerPromptProps>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      currentValue: this.value,
    };
  },

  computed: {
    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.clearErrors();

      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.getLocaleContent(this.validation.message, {
          path: 'prompts.datepicker.validation.required',
        }),
      ];

      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
