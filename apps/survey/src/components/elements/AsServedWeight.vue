<template>
  <v-chip v-if="valid" small :color="getColor()">{{ getWeigth() }}</v-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AsServedWeight',

  props: {
    weight: {
      type: Number,
      default: 0,
    },
    valid: Boolean,
  },

  methods: {
    getColor(): string {
      return this.valid ? 'success' : 'grey';
    },
    getWeigth(): string {
      return this.weight > 0 ? this.weight.toString().concat('g') : '';
    },
  },
});
</script>

<style></style>
