<template>
  <prompt-layout :text="text" :description="description">
    <v-form ref="form" @submit.prevent="submit">
      <v-time-picker
        v-model="currentValue"
        :format="promptProps.format"
        :landscape="!isMobile"
        full-width
        @input="clearErrors"
      ></v-time-picker>
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
    </v-form>
    <template v-slot:actions>
      <v-btn :block="isMobile" class="px-5" large @click="removeMeal">
        {{ $t('prompts.mealTime.no', { meal: mealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ $t('prompts.mealTime.yes', { meal: mealName }) }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { MealTimePromptProps } from '@common/prompts';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'MealTimePrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => MealTimePromptProps,
    },
    mealName: {
      type: String,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      currentValue: this.value,
      validation: this.promptProps.validation,
      errors: [] as string[],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{meal}', this.mealName ?? '')
        : (this.$t('prompts.mealTime.text', { meal: this.mealName }) as string);
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{meal}', this.mealName ?? '')
        : (this.$t('prompts.mealTime.description', { meal: this.mealName }) as string);
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    removeMeal() {
      this.$emit('removeMeal');
    },

    submit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('prompts.mealTime.validation.required') as string),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
