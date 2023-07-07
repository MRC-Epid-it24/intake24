<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mobile"
    :max-width="$vuetify.breakpoint.mobile ? undefined : '600px'"
    :min-height="$vuetify.breakpoint.mobile ? undefined : '400px'"
    :value="dialog"
  >
    <v-card ref="card" :tile="$vuetify.breakpoint.mobile">
      <v-toolbar color="primary" dark flat>
        <v-btn icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>Scan barcode</v-toolbar-title>
      </v-toolbar>
      <div ref="reader" v-resize="onReaderResize" class="reader">
        <canvas class="drawingBuffer" v-bind="{ height, width }"></canvas>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { QuaggaJSCodeReader, QuaggaJSResultObject } from '@ericblade/quagga2';
import type { PropType } from 'vue';
import Quagga from '@ericblade/quagga2';
import debounce from 'lodash/debounce';
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { VCard } from 'vuetify/lib';

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
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

const height = ref(0);
const width = ref(0);

const results = ref<QuaggaJSResultObject[]>([]);

const card = ref<InstanceType<typeof VCard>>();
const reader = ref<InstanceType<typeof HTMLFormElement>>();

const initializing = ref(false);

const updateDimensions = () => {
  const el = card.value?.$el;
  if (!el) {
    console.warn(`Reader: could not update dimensions. ${el}`);
    return;
  }

  const rect = el.getBoundingClientRect();
  const cWidth = Math.floor(rect.width);
  const cHeight = Math.floor(rect.height);
  if (width.value === cWidth && height.value === cHeight) return;

  width.value = cWidth;
  height.value = cHeight;
};

const getMedian = (numbers: number[]) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) return sorted[half];

  return (sorted[half - 1] + sorted[half]) / 2;
};

const getMedianOfCodeErrors = (codes: QuaggaJSResultObject['codeResult']['decodedCodes']) => {
  const errors = codes
    .filter(({ error }) => error !== undefined)
    .map(({ error }) => error) as number[];

  return getMedian(errors);
};

const stop = async () => {
  // Quagga.offProcessed();
  Quagga.offDetected();
  await Quagga.stop();
};

const close = async () => {
  emit('update:dialog', false);
};

const start = async () => {
  if (initializing.value) return;

  initializing.value = true;
  await stop();
  results.value = [];

  if (!reader.value) return;

  await Quagga.init(
    {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: reader.value,
        constraints: {
          width: width.value,
          height: height.value,
        },
        willReadFrequently: true,
      },
      decoder: {
        readers: props.readers,
      },
    },
    (err) => {
      if (err) {
        console.warn(err);
        return;
      }

      // Quagga.onProcessed(this.onProcessed);
      Quagga.onDetected(onDetected);

      console.log('Initialization finished. Ready to start');
      Quagga.start();
      initializing.value = false;
    }
  );
};

watch(
  () => props.dialog,
  async (val) => {
    if (val) {
      await onReaderResize();
      return;
    }

    await stop();
  }
);

onBeforeUnmount(async () => {
  await stop();
});

const onReaderResize = debounce(async () => {
  if (!props.dialog) return;

  updateDimensions();
  await start();
}, 500);

/* onProcessed(result: QuaggaJSResultObject) {}, */

const onDetected = async (result: QuaggaJSResultObject) => {
  const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
  if (err > props.errorThreshold) return;

  results.value.push(result);
  await checkResults();
};

const checkResults = async () => {
  if (results.value.length < props.successfulReads) return;

  const occurrences = results.value.reduce<Record<string, number>>((acc, curr) => {
    const { code } = curr.codeResult;
    if (!code) return acc;

    acc[code] ? ++acc[code] : (acc[code] = 1);

    return acc;
  }, {});

  const match = Object.entries(occurrences).find(([code, count]) => count >= props.successfulReads);
  if (!match) return;

  await successfulRead(match[0]);
};

const successfulRead = async (barcode: string) => {
  emit('update:model-value', barcode);
  await close();
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'BarcodeReader',
});
</script>

<style lang="scss">
.reader {
  // width: 640px;
  // height: 480px;
  min-height: 400px;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
