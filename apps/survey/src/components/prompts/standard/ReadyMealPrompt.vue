<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
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
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';

import createBasePrompt from '../createBasePrompt';

export interface ReadyMealPromptState {
  foods: { id: number; name: string; value: boolean }[];
}

export default defineComponent({
  name: 'ReadyMealPrompt',

  mixins: [createBasePrompt<'ready-meal-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<ReadyMealPromptState>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  data() {
    return { ...copy(this.initialState) };
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: { foods: this.foods } });
    },
  },
});
</script>

<style lang="scss" scoped></style>
