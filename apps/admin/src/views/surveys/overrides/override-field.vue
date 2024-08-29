<template>
  <v-col class="d-flex justify-center align-center" cols="12" md="6">
    <v-switch
      class="mt-0"
      :disabled="disabled"
      hide-details="auto"
      :input-value="value"
      @change="input"
    />
    <slot />
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OverrideField',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const input = (value: boolean) => {
      emit('change', value);
      emit('input', value);
    };

    return { input };
  },
});
</script>

<style lang="scss" scoped></style>
