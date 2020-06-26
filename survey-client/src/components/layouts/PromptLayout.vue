<template>
  <v-card>
    <slot name="header">
      <v-sheet class="pt-5 px-5">
        <h3>{{ text }}</h3>
        <p v-if="description" class="mb-0" v-html="description"></p>
      </v-sheet>
    </slot>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PromptLayout',

  props: {
    text: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped></style>
