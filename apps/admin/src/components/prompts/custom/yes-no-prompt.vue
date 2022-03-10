<template>
  <div>
    <prompt-content
      :text="text"
      :description="description"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import basePrompt from '../partials/base-prompt';

export default defineComponent({
  name: 'YesNoPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
