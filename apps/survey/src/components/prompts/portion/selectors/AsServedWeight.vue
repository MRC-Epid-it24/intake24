<template>
  <v-chip v-if="valid && weight" :color="color" small>{{ weightWithUnit }}</v-chip>
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
    valid: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    color(): string {
      return this.valid ? 'success' : 'grey';
    },
    weightWithUnit(): string {
      return this.weight > 0 ? this.weight.toString().concat('g') : '';
    },
  },
});
</script>

<style></style>
