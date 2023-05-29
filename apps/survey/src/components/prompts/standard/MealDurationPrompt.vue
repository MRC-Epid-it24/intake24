<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-slider
          class="meal-duration-slider"
          :max="prompt.max"
          :min="prompt.min"
          :step="prompt.step"
          thumb-label="always"
          :thumb-size="75"
          :value="initialState"
          @input="update"
        >
          <template #thumb-label="{ value }">
            <div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ value }}</span>
              <span class="text-h6 font-weight-bold">mins</span>
            </div>
          </template>
        </v-slider>
      </v-form>
    </v-card-text>
    <template #actions>
      <v-btn :block="isMobile" class="px-4" color="secondary" large @click.stop="action('next')">
        {{ $t(`prompts.${type}.confirm`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="secondary" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.next') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealDurationPrompt',

  mixins: [createBasePrompt<'meal-duration-prompt'>()],

  props: {
    initialState: {
      type: Number,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  emits: ['update'],

  computed: {
    isValid(): boolean {
      return this.initialState !== null;
    },
  },

  methods: {
    update(duration: string) {
      this.$emit('update', { state: duration });
    },
  },
});
</script>

<style lang="scss" scoped>
.meal-duration-slider {
  padding: 85px 30px 0 30px;
}
</style>
