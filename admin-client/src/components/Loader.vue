<template>
  <div class="loader" :class="{ show: show }">
    <img src="@/assets/loader.svg" alt="loader" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Loader',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: all 0.2s linear;
  z-index: -1;

  &.show {
    z-index: 9999;
    opacity: 1;
  }
}
</style>
