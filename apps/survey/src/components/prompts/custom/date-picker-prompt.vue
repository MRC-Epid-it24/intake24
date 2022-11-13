<template>
  <prompt-layout v-bind="{ description, text, meal, food, isValid }" @nav-action="navAction">
    <v-form ref="form" @submit.prevent="navAction('next')">
      <v-date-picker
        v-model="currentValue"
        full-width
        :landscape="!isMobile"
        @input="update"
      ></v-date-picker>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
    <template #actions>
      <continue @click.native="navAction('next')"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DatePickerPromptProps } from '@intake24/common/prompts';
import { datePickerPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'DatePickerPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<DatePickerPromptProps>,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(datePickerPromptProps, this.promptProps),
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
