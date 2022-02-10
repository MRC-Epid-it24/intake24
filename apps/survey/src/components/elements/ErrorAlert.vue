<template>
  <v-alert color="error" class="ma-0">
    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ErrorAlert',

  props: {
    errors: [],
  },
});
</script>

<style></style>
