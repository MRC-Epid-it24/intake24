<template>
  <div class="d-flex">
    <slot />
    <slot name="valid" v-bind="{ valid }">
      <valid-invalid-icon class="ms-1" :valid="valid" />
    </slot>
    <slot name="expand">
      <v-icon class="ms-1" icon="$expand" />
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
