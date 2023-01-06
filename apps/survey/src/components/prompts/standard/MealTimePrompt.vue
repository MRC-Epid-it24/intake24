<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-time-picker
        :format="prompt.format"
        full-width
        :landscape="!isMobile"
        :value="currentTime"
        @input="update"
      ></v-time-picker>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
    <template #actions>
      <v-btn :block="isMobile" class="px-5" large @click.stop="action('cancel')">
        {{ $t(`prompts.${type}.no`, { meal: localMealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-5"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="success"
        large
        @click.stop="action('next')"
      >
        {{ $t(`prompts.${type}.yes`, { meal: localMealName }) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="cancel" @click.stop="action('cancel')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.remove') }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn color="success" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.confirm') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { fromMealTime, toMealTime } from '@intake24/survey/stores/meal-food-utils';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [createBasePrompt<'meal-time-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<MealTime>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  computed: {
    currentTime(): string {
      return fromMealTime(this.initialState);
    },

    localMealName(): string {
      return this.getLocaleContent(this.meal.name);
    },

    isValid(): boolean {
      return !this.prompt.validation.required || !!this.currentTime;
    },
  },

  methods: {
    update(time: string) {
      this.$emit('update', { state: toMealTime(time) });
    },
  },
});
</script>

<style lang="scss" scoped></style>
