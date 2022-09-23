<template>
  <div
    class="d-flex"
    style="
       {
        width: 100%;
        height: 100%;
      }
    "
  >
    <v-progress-circular
      class="ma-auto"
      color="primary"
      indeterminate
      :size="100"
      :width="10"
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImagePlaceholder',

  props: {
    size: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 10,
    },
  },
});
</script>

<style></style>
