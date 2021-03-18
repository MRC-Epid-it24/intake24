<template>
  <v-alert color="error" class="ma-0">
    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
  </v-alert>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'ErrorAlert',

  props: {
    errors: [],
  },
});
</script>

<style></style>
