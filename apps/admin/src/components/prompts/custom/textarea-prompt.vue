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
    <prompt-validation v-bind.sync="validation"></prompt-validation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import basePrompt from '../partials/base-prompt';

export default Vue.extend({
  name: 'TextareaPrompt',

  mixins: [basePrompt],
});
</script>

<style lang="scss" scoped></style>
