<template>
  <div class="d-flex">
    <slot></slot>
    <slot name="valid" v-bind="{ valid }">
      <valid-invalid-icon class="ml-1" :valid="valid"></valid-invalid-icon>
    </slot>
    <slot name="expand">
      <v-icon class="ml-1">$expand</v-icon>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ValidInvalidIcon from './ValidInvalidIcon.vue';

export default defineComponent({
  name: 'ExpansionPanelActions',

  components: { ValidInvalidIcon },

  props: {
    valid: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
