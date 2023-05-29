<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-time-picker
          :format="prompt.format"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
          :value="currentTime"
          @input="update"
        ></v-time-picker>
      </v-form>
    </v-card-text>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        large
        text
        @click.stop="action('cancel')"
      >
        {{ $t(`prompts.${type}.no`, { meal: mealName }) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-4"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="secondary"
        large
        @click.stop="action('next')"
      >
        {{ $t(`prompts.${type}.yes`, { meal: mealName }) }}
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
      <v-btn color="secondary" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.confirm') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { fromMealTime, toMealTime } from '@intake24/ui/util';

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

  emits: ['update'],

  computed: {
    currentTime(): string {
      return fromMealTime(this.initialState, false);
    },

    isValid(): boolean {
      return !!this.currentTime;
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
