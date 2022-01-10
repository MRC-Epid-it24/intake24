<template>
  <prompt-layout :text="text" :description="description">
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
import Vue from 'vue';
import { BasePromptProps } from '@intake24/common/prompts';
import BasePrompt from '../BasePrompt';

export default Vue.extend({
  name: 'MealAddPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
    list: {
      type: Array as () => string[],
    },
  },

  data() {
    return {
      currentValue: null,
    };
  },

  computed: {
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
});
</script>

<style lang="scss" scoped></style>
