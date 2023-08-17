<template>
  <div>
    <v-slider
      class="drink-scale-count-slider align-center mb-4 px-2 px-sm-4"
      color="grey darken-1"
      hide-details="auto"
      thumb-label="always"
      :thumb-size="50"
      v-bind="{
        max,
        min,
        step,
        value,
      }"
      @input="updateValue($event)"
    >
      <template #prepend>
        <v-icon large @click="decrement">fas fa-circle-minus</v-icon>
      </template>
      <template #append>
        <v-icon large @click="increment">fas fa-circle-plus</v-icon>
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuantitySlider',

  props: {
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 10,
    },
    step: {
      type: Number,
      default: 1,
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
      updateValue(props.value - props.step);
    };

    const increment = () => {
      updateValue(props.value + props.step);
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

<style lang="scss" scoped>
.drink-scale-count-slider {
  padding-top: 85px;
}
</style>
