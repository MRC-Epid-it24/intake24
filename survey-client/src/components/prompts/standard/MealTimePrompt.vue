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
        {{ $t('prompts.mealTime.no', { meal: meal.name }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ $t('prompts.mealTime.yes', { meal: meal.name }) }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { MealTimePromptProps, mealTimePromptProps } from '@common/prompts';
import recall from '@/util/Recall';
import Meal from '@/util/Meal';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'MealTimePrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => MealTimePromptProps,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { text, description, ...rest } = merge(mealTimePromptProps, this.promptProps);

    return {
      ...rest,
      currentValue: this.value,
      recall,
      errors: [] as string[],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    mealIndex(): number {
      return parseInt(this.$route.params.mealId, 10);
    },
    meal(): Meal {
      return this.recall.getMeal(this.mealIndex);
    },
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{meal}', this.meal.name ?? '')
        : (this.$t('prompts.mealTime.text', { meal: this.meal.name }) as string);
    },
    description(): string {
      const description = this.promptProps.text[this.$i18n.locale];
      return description
        ? description.replace('{meal}', this.meal.name ?? '')
        : (this.$t('prompts.mealTime.description', { meal: this.meal.name }) as string);
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    removeMeal() {
      this.recall.removeMeal(this.mealIndex);
    },

    submit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('prompts.mealTime.validation.required') as string),
        ];
        return;
      }

      this.meal.time = this.currentValue;
      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
