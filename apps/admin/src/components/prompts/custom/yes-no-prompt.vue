<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description, textRequired: true }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
    ></prompt-content>
    <prompt-actions :actions="actions" @update:actions="update('actions', $event)"></prompt-actions>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'YesNoPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
