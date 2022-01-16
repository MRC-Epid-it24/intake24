<template>
  <v-skeleton-loader v-intersect="intersected" :type="type" />
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'IntersectableSkeleton',

  props: {
    type: {
      type: String,
      default: 'list-item',
    },
  },

  methods: {
    intersected(...arg: any[]) {
      this.$emit('intersected', ...arg);
    },
  },
});
</script>

<style lang="scss" scoped></style>
