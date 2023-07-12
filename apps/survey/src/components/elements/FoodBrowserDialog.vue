<template>
  <v-dialog fullscreen :value="dialog" @input="$emit('update:dialog', $event)">
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
    dialog: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss"></style>
