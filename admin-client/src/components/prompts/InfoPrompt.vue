<template>
  <prompt-content
    :text="text"
    :description="description"
    @update:text="update('text', $event)"
    @update:description="update('description', $event)"
  ></prompt-content>
</template>

<script lang="ts">
import Vue from 'vue';
import prompt from './partials/Prompt';

export default Vue.extend({
  name: 'InfoPrompt',

  mixins: [prompt],
});
</script>

<style lang="scss" scoped></style>
