<template>
  <v-col
    class="d-flex gc-2 align-center" cols="12" md="6"
    v-bind="attr"
  >
    <v-switch
      v-if="override"
      class="mt-0"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="input"
    />
    <slot />
  </v-col>
  <slot name="addon" />
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  override: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['change', 'update:modelValue']);

const attr = useAttrs();

function input(value: boolean | null) {
  emit('change', value);
  emit('update:modelValue', value);
}
</script>

<style lang="scss" scoped></style>
