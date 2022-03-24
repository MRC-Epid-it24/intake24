<template>
  <prompt-layout :text="text" :description="description">
    <v-col md="8" sm="12" v-show="this.hasMeals === 0">
      <h4>{{ $t('prompts.mealAdding.noMeal') }}</h4>
    </v-col>
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="submit">
        <v-combobox
          v-model="currentValue"
          clearable
          hide-selected
          small-chips
          outlined
          :items="listofmeals"
        >
        </v-combobox>
      </v-form>
    </v-col>
    <template v-slot:actions>
      <v-btn :block="isMobile" class="px-5" large @click="abortMeal">
        {{ $t('prompts.mealAdding.no') }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ma-0': isMobile, 'mb-2': isMobile }"
        :disabled="!currentValue"
        class="px-5"
        color="success"
        large
        @click="submit"
      >
        {{ $t('prompts.mealAdding.yes') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { BasePromptProps } from '@intake24/common/prompts';
import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    list: {
      type: Array as PropType<string[]>,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      currentValue: null,
    };
  },

  computed: {
    ...mapState(useSurvey, [
      'selectedMealIndex',
      'selectedFoodIndex',
      'currentTempPromptAnswer',
      'hasMeals',
    ]),

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

  methods: {
    submit() {
      this.$emit('addMeal', this.currentValue);
    },

    abortMeal() {
      this.$emit('abortMeal');
    },
  },
  watch: {
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
  },
});
</script>

<style lang="scss" scoped></style>
