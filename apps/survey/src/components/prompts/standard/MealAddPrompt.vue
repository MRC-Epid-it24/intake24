<template>
  <prompt-layout v-bind="{ description: localeDescription, text: localeText }">
    <v-col md="8" sm="12">
      <v-form ref="form" @submit.prevent="add">
        <v-combobox
          v-model="currentValue"
          autofocus
          clearable
          hide-selected
          :hint="$t('prompts.addMeal.hint')"
          :items="meals"
          :label="$t('prompts.addMeal.label')"
          outlined
          persistent-hint
          small-chips
        >
        </v-combobox>
      </v-form>
    </v-col>
    <template #actions>
      <continue :disabled="!isValid" :label="$t('prompts.addMeal.yes')" @click="add"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { mealAddPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  mixins: [BasePrompt],

  props: {
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    meals: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(mealAddPromptProps, this.promptProps),
      currentValue: null,
    };
  },

  computed: {
    localeText(): string {
      return this.getLocaleContent(this.text, { path: 'prompts.addMeal.text' });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.description, { path: 'prompts.addMeal.description' });
    },

    isValid() {
      return !!this.currentValue;
    },
  },

  methods: {
    add() {
      this.$emit('add', this.currentValue);
    },

    cancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="scss" scoped></style>
