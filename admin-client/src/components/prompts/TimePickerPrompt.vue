<template>
  <div>
    <prompt-content
      :text="text"
      :description="description"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-validation v-bind.sync="validation"></prompt-validation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import prompt from './partials/Prompt';

export default Vue.extend({
  name: 'TimePickerPrompt',

  mixins: [prompt],
});
</script>

<style lang="scss" scoped></style>
