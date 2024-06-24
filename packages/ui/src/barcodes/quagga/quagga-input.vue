<template>
  <v-text-field ref="inputRef" v-model="barcode" v-bind="{ ...$attrs, name }" v-on="$listeners">
    <template #append>
      <v-icon @click.stop.prevent="open">
        fas fa-barcode
      </v-icon>
      <quagga-reader
        :dialog.sync="dialog"
        :model-value.sync="barcode"
        v-bind="{ errorThreshold, readers: options.readers, successfulReads }"
      />
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import { defineComponent, ref } from 'vue';

import type { QuaggaScanner } from '@intake24/common/barcodes';

import QuaggaReader from './quagga-reader.vue';

const props = defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: String as PropType<string | null>,
    default: '',
  },
  name: {
    type: String,
    default: 'barcode',
  },
  errorThreshold: {
    type: Number,
  },
  options: {
    type: Object as PropType<QuaggaScanner>,
    required: true,
  },
  successfulReads: {
    type: Number,
  },
});

const emit = defineEmits(['update:model-value']);

const barcode = useVModel(props, 'modelValue', emit);

const dialog = ref(false);
const inputRef = ref<InstanceType<typeof HTMLFormElement>>();

function open(event: Event) {
  event.preventDefault();
  inputRef.value?.blur();

  dialog.value = true;
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'QuaggaInput',
});
</script>

<style lang="scss"></style>
