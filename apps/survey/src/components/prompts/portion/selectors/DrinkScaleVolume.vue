<template>
  <v-chip v-if="valid && volume" :color="color" small>{{ volumeWithUnit }}</v-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DrinkScaleVolume',

  props: {
    volume: {
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
    volumeWithUnit(): string {
      return this.volume > 0 ? this.volume.toString().concat(' ml') : '';
    },
  },
});
</script>

<style></style>
