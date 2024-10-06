<template>
  <v-col class="d-flex justify-center align-center" cols="12" md="6">
    <v-switch
      class="mt-0"
      :disabled="disabled"
      hide-details="auto"
      :model-value="modelValue"
      @update:model-value="input"
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
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit }) {
    const input = (value: boolean) => {
      emit('change', value);
      emit('update:modelValue', value);
    };

    return { input };
  },
});
</script>

<style lang="scss" scoped></style>
