<template>
  <prompt-layout v-bind="{ description: localeDescription, text: localeText, food, meal, isValid }">
    <v-form ref="form" @submit.prevent="navAction('next')">
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
      <v-btn :block="isMobile" class="px-5" large @click="navAction('cancel')">
        {{ $t('prompts.mealTime.no', { meal: localMealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="success"
        large
        @click="navAction('next')"
      >
        {{ $t('prompts.mealTime.yes', { meal: localMealName }) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="cancel">
        <span class="text-overline font-weight-medium" @click="navAction('cancel')">
          {{ $t('common.action.remove') }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn color="success" :disabled="!isValid" value="next" @click="navAction('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.confirm._') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealState, MealTime } from '@intake24/common/types';
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
    meal: {
      type: Object as PropType<MealState>,
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
    };
  },

  computed: {
    localMealName(): string {
      return this.getLocaleContent(this.meal.name);
    },

    localeText(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.mealTime.text',
        params: { meal: this.localMealName },
      });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.promptProps.description, {
        // path: 'prompts.mealTime.description',
        params: { meal: this.localMealName },
      });
    },

    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    update(time: string) {
      this.$emit('update', { state: toMealTime(time), valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
