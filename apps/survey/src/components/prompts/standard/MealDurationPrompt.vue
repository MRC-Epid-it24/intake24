<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-slider
          v-model="state"
          class="meal-duration-slider px-8"
          color="grey darken-1"
          :max="prompt.max"
          :min="prompt.min"
          :step="prompt.step"
          thumb-label="always"
          :thumb-size="75"
        >
          <template #thumb-label="{ value }">
            <div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ value }}</span>
              <span class="text-h6 font-weight-bold">{{ promptI18n.minutes }}</span>
            </div>
          </template>
        </v-slider>
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')">
        {{ promptI18n.confirm }}
      </next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')">
        {{ promptI18n.confirm }}
      </next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealDurationPrompt',

  mixins: [createBasePrompt<'meal-duration-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });
    const isValid = computed(() => state.value !== null);
    const promptI18n = computed(() => translatePrompt(['minutes', 'confirm']));

    return { action, isValid, promptI18n, state };
  },
});
</script>

<style lang="scss" scoped>
.meal-duration-slider {
  padding-top: 85px;
}
</style>
