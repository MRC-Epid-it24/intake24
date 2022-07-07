<template>
  <v-icon :color="getColor()">{{ getIcon() }}</v-icon>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidInvalidIcon',

  props: {
    valid: Boolean,
  },

  methods: {
    getColor(): string {
      return this.valid ? 'success' : 'error';
    },
    getIcon(): string {
      return this.valid ? 'fas fa-fw fa-check' : 'fas fa-fw fa-exclamation';
    },
  },
});
</script>

<style></style>
