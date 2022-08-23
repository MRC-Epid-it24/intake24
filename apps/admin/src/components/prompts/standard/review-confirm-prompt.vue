<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import basePrompt from '../partials/base-prompt';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
