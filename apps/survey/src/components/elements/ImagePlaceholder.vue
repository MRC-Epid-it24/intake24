<template>
  <div class="d-flex img-placeholder">
    <v-progress-circular
      class="ma-auto"
      color="primary"
      indeterminate
      :size="size"
      :width="width"
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

<style lang="scss" scoped>
.img-placeholder {
  width: 100%;
  height: 100%;
}
</style>
