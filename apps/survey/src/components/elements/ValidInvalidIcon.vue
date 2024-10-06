<template>
  <v-icon class="no-rotate" :color="color" :icon="icon" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidInvalidIcon',

  props: {
    valid: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    color(): string {
      return this.valid ? 'success' : 'error';
    },
    icon(): string {
      return this.valid ? 'fas fa-fw fa-check' : 'fas fa-fw fa-exclamation';
    },
  },
});
</script>

<style lang="scss" scoped>
.no-rotate {
  transform: none !important;
}
</style>
