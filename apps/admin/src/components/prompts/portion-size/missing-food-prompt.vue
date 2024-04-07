<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" />
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'MissingFoodPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
