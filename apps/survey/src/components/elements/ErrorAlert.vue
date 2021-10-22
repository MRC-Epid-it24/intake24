<template>
  <v-alert color="error" class="ma-0">
    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ErrorAlert',

  props: {
    errors: [],
  },
});
</script>

<style></style>
