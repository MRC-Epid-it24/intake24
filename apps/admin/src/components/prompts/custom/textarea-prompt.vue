<template>
  <div>
    <prompt-validation v-bind.sync="validation"></prompt-validation>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'TextareaPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
