<template>
  <v-tabs-window-item key="options" value="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
