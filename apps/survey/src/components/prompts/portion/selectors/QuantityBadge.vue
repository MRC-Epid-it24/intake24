<template>
  <v-chip v-if="valid && amount" :color="color" small>{{ amountWithUnit }}</v-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuantityBadge',

  props: {
    amount: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'g',
    },
    valid: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    color(): string {
      return this.valid ? 'secondary' : 'grey';
    },

    amountWithUnit(): string {
      return this.amount > 0 ? Math.round(this.amount).toString().concat(this.unit) : '';
    },
  },
});
</script>

<style></style>
