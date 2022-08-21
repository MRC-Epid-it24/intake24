<template>
  <v-alert color="error" class="ma-0">
    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
  </v-alert>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorAlert',

  props: {
    errors: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
});
</script>

<style></style>
