<template>
  <v-text-field ref="inputRef" v-model="barcode" v-bind="{ label, name }" outlined>
    <template #append>
      <v-icon @click.stop.prevent="open">fas fa-barcode</v-icon>
      <barcode-reader
        :dialog.sync="dialog"
        :model-value.sync="barcode"
        v-bind="{ errorThreshold, readers, successfulReads }"
      ></barcode-reader>
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
import type { QuaggaJSCodeReader } from '@ericblade/quagga2';
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import { defineComponent, ref } from 'vue';

import BarcodeReader from './barcode-reader.vue';

const props = defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'barcode',
  },
  errorThreshold: {
    type: Number,
    default: 0.2,
  },
  readers: {
    type: Array as PropType<QuaggaJSCodeReader[]>,
    default: () => ['code_128_reader', 'ean_reader'],
  },
  successfulReads: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(['update:model-value', 'update:dialog']);

const barcode = useVModel(props, 'modelValue', emit);

const dialog = ref(false);
const inputRef = ref<InstanceType<typeof HTMLFormElement>>();

const open = (event: Event) => {
  event.preventDefault();
  inputRef.value?.blur();

  dialog.value = true;
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'BarcodeInput',
});
</script>

<style lang="scss"></style>
