<template>
  <div>
    <v-slider
      class="quantity-slider__slider align-center mb-4 px-2 px-sm-4"
      color="secondary"
      hide-details
      :label="$t('prompts.quantity._')"
      :max="max.value"
      :min="min.value"
      :step="step"
      :style="{ 'padding-top': `${current.size + 10}px` }"
      :thumb-label="current ? `always` : false"
      :thumb-size="current.size"
      :value="value"
      @input="updateValue($event)"
    >
      <template #prepend>
        <v-icon color="secondary" large :title="$t('prompts.quantity.less')" @click="decrement">
          fas fa-circle-minus
        </v-icon>
      </template>
      <template #append>
        <v-icon color="secondary" large :title="$t('prompts.quantity.more')" @click="increment">
          fas fa-circle-plus
        </v-icon>
      </template>
      <template #thumb-label="{ value: thumbValue }">
        <div class="d-flex flex-column align-center">
          <span class="text-h5 font-weight-bold">{{ thumbValue }}</span>
        </div>
      </template>
    </v-slider>
    <v-row v-if="confirm">
      <v-col cols="12" sm="auto">
        <v-btn :block="isMobile" color="primary" @click="updateConfirmed(true)">
          {{ $t('common.action.continue') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Slider } from '@intake24/common/prompts';

export default defineComponent({
  name: 'QuantitySlider',

  props: {
    confirm: {
      type: Boolean,
      default: true,
    },
    confirmed: {
      type: Boolean,
      default: true,
    },
    current: {
      type: Object as PropType<Slider['current']>,
      required: true,
    },
    min: {
      type: Object as PropType<Slider['min']>,
      required: true,
    },
    max: {
      type: Object as PropType<Slider['max']>,
      required: true,
    },
    step: {
      type: Number as PropType<Slider['step']>,
      required: true,
    },
    value: {
      type: Number,
      default: 1,
    },
  },

  emits: ['input', 'update:confirmed'],

  setup(props, { emit }) {
    const updateConfirmed = (value: boolean) => {
      emit('update:confirmed', value);
    };

    const updateValue = (value: number) => {
      emit('input', value);

      if (props.confirmed)
        updateConfirmed(false);
    };

    const decrement = () => {
      updateValue(props.value - props.step);
    };

    const increment = () => {
      updateValue(props.value + props.step);
    };

    return {
      decrement,
      increment,
      updateConfirmed,
      updateValue,
    };
  },
});
</script>

<style lang="scss"></style>
