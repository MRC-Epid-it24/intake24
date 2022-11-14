<template>
  <prompt-layout
    v-bind="{ description: localeDescription, text: localeText, food, meal, isValid }"
    @nav-action="navAction"
  >
    <v-form ref="form" @submit.prevent="navAction('next')">
      <v-checkbox
        v-for="food in foods"
        :key="food.id"
        v-model="food.value"
        class="mt-2"
        :error="hasErrors"
        hide-details="auto"
        :label="food.name"
        @change="update"
      ></v-checkbox>
    </v-form>
    <template #actions>
      <continue :disabled="!isValid" @click="navAction('next')"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ReadyMealPromptProps } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { readyMealPromptProps } from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export interface ReadyMealPromptState {
  foods: { id: number; name: string; value: boolean }[];
}

export default defineComponent({
  name: 'ReadyMealPrompt',

  mixins: [BasePrompt],

  props: {
    initialState: {
      type: Object as PropType<ReadyMealPromptState>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    promptProps: {
      type: Object as PropType<ReadyMealPromptProps>,
      required: true,
    },
  },

  data() {
    return { ...merge(readyMealPromptProps, this.promptProps), ...copy(this.initialState) };
  },

  computed: {
    localMealName(): string {
      return this.getLocaleContent(this.meal.name);
    },

    localeText(): string {
      return this.getLocaleContent(this.promptProps.text, {
        path: 'prompts.readyMeal.text',
        params: { meal: this.localMealName },
      });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.promptProps.description, {
        path: 'prompts.readyMeal.description',
        params: { meal: this.localMealName },
      });
    },

    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: { foods: this.foods }, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
