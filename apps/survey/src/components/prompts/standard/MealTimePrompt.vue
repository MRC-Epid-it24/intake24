<template>
  <prompt-layout v-bind="{ description: localeDescription, text: localeText }">
    <v-form ref="form" @submit.prevent="confirm">
      <v-time-picker
        :format="promptProps.format"
        full-width
        :landscape="!isMobile"
        :v-model="currentValue"
        :value="currentValue"
        @input="update"
      ></v-time-picker>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
    <template #actions>
      <v-btn :block="isMobile" class="px-5" large @click="removeMeal">
        {{ $t('prompts.mealTime.no', { meal: getLocalMealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="success"
        large
        @click="confirm"
      >
        {{ $t('prompts.mealTime.yes', { meal: getLocalMealName }) }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealTime, RequiredLocaleTranslation } from '@intake24/common/types';
import { mealTimePromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { fromMealTime, toMealTime } from '@intake24/survey/stores/meal-food-utils';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [BasePrompt],

  props: {
    initialState: {
      type: Object as PropType<MealTime>,
      required: true,
    },
    mealName: {
      type: Object as PropType<RequiredLocaleTranslation>,
      required: true,
    },
    promptProps: {
      type: Object as PropType<MealTimePromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(mealTimePromptProps, this.promptProps),
      currentValue: fromMealTime(this.initialState),
      errors: [] as string[],
    };
  },

  computed: {
    getLocalMealName(): string {
      return this.getLocaleContent(this.mealName);
    },

    hasErrors(): boolean {
      return !!this.errors.length;
    },

    localeText(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.mealTime.text',
        params: { meal: this.getLocalMealName },
      });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.promptProps.description, {
        // path: 'prompts.mealTime.description',
        params: { meal: this.getLocalMealName },
      });
    },

    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    removeMeal() {
      this.$emit('remove-meal');
    },

    update(time: string) {
      this.clearErrors();

      this.$emit('update', { state: toMealTime(time), valid: this.isValid });
    },

    confirm() {
      if (!this.isValid) {
        this.errors = [
          this.getLocaleContent(this.validation.message, {
            path: 'prompts.mealTime.validation.required',
          }),
        ];
        return;
      }

      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped></style>
