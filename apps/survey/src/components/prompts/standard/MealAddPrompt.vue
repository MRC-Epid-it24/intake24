<template>
  <prompt-layout v-bind="{ description, text }">
    <v-col v-show="hasMeals === 0" md="8" sm="12">
      <h4>{{ $t('prompts.mealAdding.noMeal') }}</h4>
    </v-col>
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="submit">
        <v-combobox
          v-model="currentValue"
          clearable
          hide-selected
          :items="listofmeals"
          outlined
          small-chips
        >
        </v-combobox>
      </v-form>
    </v-col>
    <template #actions>
      <v-btn :block="isMobile" class="px-5" large @click="abortMeal">
        {{ $t('prompts.mealAdding.no') }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        color="success"
        :disabled="!currentValue"
        large
        @click="submit"
      >
        {{ $t('prompts.mealAdding.yes') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { useSurvey } from '@intake24/survey/stores';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    list: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data() {
    return {
      currentValue: null,
    };
  },

  computed: {
    ...mapState(useSurvey, ['hasMeals']),

    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      if (text) return text;
      return '';
    },

    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      if (description) return description;
      return '';
    },

    listofmeals(): string[] {
      if (this.list) return this.list;
      return [];
    },
  },
  /* watch: {
    currentValue: {
      handler(value: string) {
        this.$emit('tempChanging', {
          response: value,
          modified: true,
          new: false,
          mealIndex: this.selectedMealIndex,
          foodIndex: this.selectedFoodIndex,
          prompt: this.promptComponent,
        });
      },
    },
  }, */

  methods: {
    submit() {
      this.$emit('addMeal', this.currentValue);
    },

    abortMeal() {
      this.$emit('abortMeal');
    },
  },
});
</script>

<style lang="scss" scoped></style>
