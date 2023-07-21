<template>
  <div>
    <v-slider
      class="drink-scale-count-slider align-center mb-4"
      color="primary"
      hide-details="auto"
      thumb-label="always"
      :thumb-size="50"
      v-bind="{
        max,
        min,
        value,
      }"
      @input="updateValue($event)"
    >
      <template #prepend>
        <v-icon color="primary" large @click="decrement">fas fa-circle-minus</v-icon>
      </template>
      <template #append>
        <v-icon color="primary" large @click="increment">fas fa-circle-plus</v-icon>
      </template>
      <template #thumb-label="{ value }">
        <div class="d-flex flex-column align-center">
          <span class="text-h5 font-weight-bold">{{ value }}</span>
        </div>
      </template>
    </v-slider>
    <v-row class="m">
      <v-col cols="12" sm="auto">
        <v-btn :block="isMobile" color="secondary" @click="confirm">
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
      updateValue(props.value - 1);
    };

    const increment = () => {
      updateValue(props.value + 1);
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
  padding: 85px 15px 0 15px;
}
</style>
