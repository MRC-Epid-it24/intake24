<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
