<template>
  <v-skeleton-loader v-intersect="intersected" :type="type" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IntersectableSkeleton',

  props: {
    type: {
      type: String,
      default: 'list-item',
    },
  },

  emits: ['intersected'],

  methods: {
    intersected(...arg: any[]) {
      this.$emit('intersected', ...arg);
    },
  },
});
</script>

<style lang="scss" scoped></style>
