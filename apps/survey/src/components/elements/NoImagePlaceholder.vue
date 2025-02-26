<template>
  <svg class="no-image-svg" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#f8f8f8" height="200" width="200" />

    <g transform="translate(30, 30) rotate(-10)">
      <rect fill="#fff" height="90" stroke="#ccc" stroke-width="2" width="70" x="0" y="0" />
      <rect fill="#ddd" height="50" width="50" x="10" y="10" />
      <rect fill="#ccc" height="10" width="20" x="25" y="65" />
    </g>

    <g transform="translate(65, 20) rotate(5)">
      <rect fill="#fff" height="90" stroke="#ccc" stroke-width="2" width="70" x="0" y="0" />
      <rect fill="#ddd" height="50" width="50" x="10" y="10" />
      <rect fill="#ccc" height="10" width="20" x="25" y="65" />
    </g>

    <g transform="translate(90, 30) rotate(-5)">
      <rect fill="#fff" height="90" stroke="#ccc" stroke-width="2" width="70" x="0" y="0" />
      <rect fill="#ddd" height="50" width="50" x="10" y="10" />
      <rect fill="#ccc" height="10" width="20" x="25" y="65" />
    </g>

    <text fill="#888" font-family="Arial, sans-serif" font-size="14" letter-spacing="0.5" text-anchor="middle" x="100" y="170">
      {{ $t('common.noImagePlaceholder') }}
    </text>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoImagePlaceholder',
});
</script>

<style scoped>
  .no-image-svg {
  height: 100%;
  width: 100%;
}
</style>
