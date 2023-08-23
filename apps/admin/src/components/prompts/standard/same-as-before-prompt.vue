<template>
  <v-tab-item key="options" value="options"></v-tab-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'SameAsBeforePrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
