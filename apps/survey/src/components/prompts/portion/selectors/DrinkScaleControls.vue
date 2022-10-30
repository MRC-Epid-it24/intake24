<template>
  <v-row>
    <v-col>
      <v-btn block @click="modifySliderValue(-10)">
        {{ $t(`portion.${portionSizeMethod}.${type}.less`) }}
      </v-btn>
    </v-col>
    <v-col>
      <v-btn block @click="modifySliderValue(10)">
        {{ $t(`portion.${portionSizeMethod}.${type}.more`) }}
      </v-btn>
    </v-col>
    <v-col align="center" md="4" xs="12">
      <v-btn block color="success" @click="confirm">
        {{ $t(`portion.${portionSizeMethod}.${type}.confirm`) }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { estimateType } from '../DrinkScalePrompt.vue';

export default defineComponent({
  name: 'DrinkScaleControls',

  props: {
    type: {
      type: String as PropType<estimateType>,
      default: 'serving',
    },
    portionSizeMethod: {
      type: String as PropType<'drink-scale' | 'as-served'>,
      default: 'drink-scale',
    },
  },

  computed: {},

  methods: {
    confirm() {
      this.$emit('confirm-estimate', this.type);
    },
    modifySliderValue(delta: number) {
      this.$emit('modify-slider-value', { type: this.type, delta: delta });
    },
  },
});
</script>

<style></style>
