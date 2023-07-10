<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-date-picker
          full-width
          :landscape="!isMobile"
          :max="max"
          :value="value"
          @input="update"
        ></v-date-picker>
        <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
      </v-form>
    </v-card-text>
  </card-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'DatePickerPrompt',

  mixins: [createBasePrompt<'date-picker-prompt'>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  emits: ['input'],

  computed: {
    max() {
      return this.prompt.futureDates ? undefined : new Date().toISOString().substring(0, 10);
    },
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.value;
    },
  },

  methods: {
    update(value: string) {
      this.clearErrors();

      this.$emit('input', value);
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.getLocaleContent(this.prompt.validation.message, {
          path: `prompts.${this.type}.validation.required`,
        }),
      ];

      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
