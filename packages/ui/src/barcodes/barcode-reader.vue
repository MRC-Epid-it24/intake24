<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mobile"
    :max-width="$vuetify.breakpoint.mobile ? undefined : '640px'"
    :min-height="$vuetify.breakpoint.mobile ? undefined : '480px'"
  >
    <v-card ref="card" :tile="$vuetify.breakpoint.mobile">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon :title="$t('common.action.close')" @click.stop="close">
          <v-icon>$close</v-icon>
        </v-btn>
        <v-toolbar-title>Scan barcode</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch v-model="locate" class="mt-0" hide-details name="locate">
          <template #label>
            <v-icon>fas fa-crosshairs</v-icon>
          </template>
        </v-switch>
        <v-divider class="ml-2" vertical></v-divider>
        <v-btn
          color="white"
          :disabled="!deviceCapabilities.torch"
          icon
          title="Torch"
          @click="toggleTorch"
        >
          <v-icon>fas fa-lightbulb</v-icon>
        </v-btn>
      </v-toolbar>
      <div ref="reader" v-resize="onReaderResize" class="barcode-reader">
        <canvas class="drawingBuffer"></canvas>
        <video :style="{ height: `${height - 56}px` }"></video>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { QuaggaJSCodeReader, QuaggaJSResultObject } from '@ericblade/quagga2';
import type { PropType } from 'vue';
import Quagga from '@ericblade/quagga2';
import { useVModel } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { VCard } from 'vuetify/lib';

import { useMessages } from '../stores';

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String as PropType<string | null>,
    default: '',
  },
  errorThreshold: {
    type: Number,
    default: 0.2,
  },
  readers: {
    type: Array as PropType<QuaggaJSCodeReader[]>,
    default: () => ['ean_reader', 'ean_8_reader', 'ean_5_reader'],
  },
  successfulReads: {
    type: Number,
    default: 3,
  },
  vibrateOnRead: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:dialog', 'update:model-value']);

const dialog = useVModel(props, 'dialog', emit);

const height = ref(0);
const width = ref(0);

const card = ref<InstanceType<typeof VCard>>();
const reader = ref<InstanceType<typeof HTMLFormElement>>();

const initializing = ref(false);
const capabilities = ref<MediaTrackCapabilities | null>(null);
const deviceCapabilities = ref<{ torch: boolean }>({ torch: false });
const results = ref<QuaggaJSResultObject[]>([]);
const locate = ref(true);

const initCapabilities = () => {
  const track = Quagga.CameraAccess.getActiveTrack();
  if (!track) return;

  capabilities.value = track.getCapabilities();

  if ('torch' in capabilities.value && typeof capabilities.value.torch === 'boolean')
    deviceCapabilities.value.torch = true;
};

const drawScanBox = () => {
  const ctx = Quagga.canvas.ctx.overlay;
  const canvas = Quagga.canvas.dom.overlay;
  const canvasWidth = parseInt(canvas.getAttribute('width') ?? '0');
  const canvasHeight = parseInt(canvas.getAttribute('height') ?? '0');

  const boxHeight = canvasHeight * 0.3;
  const boxWidth = canvasWidth * 0.8;

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FAFAFA';
  ctx.rect(canvasWidth * 0.1, canvasHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#EEEEEE';
  ctx.moveTo(canvasWidth * 0.15, canvasHeight * 0.5);
  ctx.lineTo(canvasWidth * 0.85, canvasHeight * 0.5);
  ctx.stroke();
};

const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.clearRect(
    0,
    0,
    parseInt(canvas.getAttribute('width') ?? '0'),
    parseInt(canvas.getAttribute('height') ?? '0')
  );
};

const drawResult = (result: QuaggaJSResultObject) => {
  const ctx = Quagga.canvas.ctx.overlay;
  const canvas = Quagga.canvas.dom.overlay;

  if (result.boxes.length) {
    clearCanvas(ctx, canvas);

    result.boxes
      .filter((box) => box !== result.box)
      .forEach((box) => {
        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, { color: '#FAFAFA', lineWidth: 2 });
      });
  }

  if (result.box.length) {
    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, {
      color: '#EEEEEE',
      lineWidth: 2,
    });
  }
};

const toggleTorch = async () => {
  const track = Quagga.CameraAccess.getActiveTrack();

  //@ts-expect-error torch is not in the types ?
  await track?.applyConstraints({ advanced: [{ torch: !track.getSettings().torch }] });
};

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

const close = () => {
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
          facingMode: 'environment',
          height: { min: 480, ideal: 720 },
          width: { min: 640, ideal: 1280 },
        },
        area: locate.value ? undefined : { top: '45%', right: '0%', left: '0%', bottom: '45%' },
        willReadFrequently: true,
      },
      locate: locate.value,
      decoder: {
        readers: props.readers,
      },
    },
    (err) => {
      if (err) {
        console.warn(err);
        useMessages().warning('Could not find suitable camera.');
        return;
      }

      // Quagga.onProcessed(this.onProcessed);
      Quagga.onDetected(onDetected);
      initCapabilities();

      if (!locate.value) drawScanBox();

      console.log('Initialization finished. Ready to start');
      Quagga.start();
      initializing.value = false;
    }
  );
};

watch(locate, async () => {
  await start();
});

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

const onDetected = (result: QuaggaJSResultObject) => {
  const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);

  if (err > props.errorThreshold) return;

  if (locate.value) drawResult(result);

  results.value.push(result);
  checkResults();
};

const checkResults = () => {
  if (results.value.length < props.successfulReads) return;

  const occurrences = results.value.reduce<Record<string, number>>((acc, curr) => {
    const { code } = curr.codeResult;
    if (!code) return acc;

    acc[code] ? ++acc[code] : (acc[code] = 1);

    return acc;
  }, {});

  const match = Object.entries(occurrences).find(([code, count]) => count >= props.successfulReads);
  if (!match) return;

  successfulRead(match[0]);
};

const successfulRead = (barcode: string) => {
  if (props.vibrateOnRead) navigator.vibrate(200);

  emit('update:model-value', barcode);
  close();
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'BarcodeReader',
});
</script>

<style lang="scss">
.barcode-reader {
  position: relative;
  min-height: 480px;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  video {
    display: block;
    width: 100%;
    object-fit: cover;
  }
}
</style>
