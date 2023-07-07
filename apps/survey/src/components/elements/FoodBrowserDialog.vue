<template>
  <v-dialog fullscreen :value="value" @input="$emit('input', $event)">
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FoodBrowserDialog',

  props: {
    value: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss"></style>
