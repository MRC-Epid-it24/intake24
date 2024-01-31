<template>
  <div>
    <v-slider
      class="quantity-slider__slider align-center mb-4 px-2 px-sm-4"
      color="secondary"
      hide-details
      :label="$t('prompts.quantity._')"
      :max="slider.max.value"
      :min="slider.min.value"
      :step="slider.step"
      :style="{ 'padding-top': `${slider.current.size + 10}px` }"
      :thumb-label="slider.current ? `always` : false"
      :thumb-size="slider.current.size"
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
    <v-row>
      <v-col cols="12" sm="auto">
        <v-btn :block="isMobile" color="primary" @click="confirm">
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
    slider: {
      type: Object as PropType<Slider>,
      required: true,
    },
    value: {
      type: Number,
      default: 1,
    },
  },

  emits: ['input', 'confirm'],

  setup(props, { emit }) {
    const confirm = () => {
      emit('confirm');
    };

    const updateValue = (value: number) => {
      emit('input', value);
    };

    const decrement = () => {
      updateValue(props.value - props.slider.step);
    };

    const increment = () => {
      updateValue(props.value + props.slider.step);
    };

    return {
      confirm,
      decrement,
      increment,
      updateValue,
    };
  },
});
</script>

<style lang="scss"></style>
