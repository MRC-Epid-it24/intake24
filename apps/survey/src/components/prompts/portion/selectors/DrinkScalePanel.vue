<template>
  <div>
    <div
      class="drink-scale-drawer mb-4"
      :class="{ selected: cursorInScale }"
      @mousedown="touchUpdateSlider"
      @mousemove="onTrackOverlay($event)"
    >
      <v-img ref="imgDrink" v-resize="onImgResize" :src="scale.baseImageUrl">
        <template #placeholder>
          <image-placeholder></image-placeholder>
        </template>
      </v-img>
      <v-img
        class="drink-scale-image-overlay"
        :src="scale.overlayImageUrl"
        :style="overlayBackground"
      >
      </v-img>
      <div class="drink-scale-image-slider mr-10" :style="{ bottom: sliderBottom }">
        <v-slider
          v-model="sliderValue"
          :height="sliderHeight"
          :max="sliderMax"
          :min="sliderMin"
          thumb-color="primary"
          vertical
        ></v-slider>
      </div>
      <div class="drink-scale-image-label">
        <v-chip
          class="ma-1 ma-md-2 pa-3 pa-md-4 text-h6 font-weight-bold primary--text border-primary-1"
        >
          {{ label }}
        </v-chip>
      </div>
    </div>
    <v-row>
      <v-col>
        <v-btn
          block
          color="secondary"
          :disabled="sliderValue <= sliderMin"
          text
          @click="updateSlider(-sliderStep)"
        >
          {{ $t(`prompts.drinkScale.${type}.less`) }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          block
          color="secondary"
          :disabled="sliderValue >= sliderMax"
          text
          @click="updateSlider(sliderStep)"
        >
          {{ $t(`prompts.drinkScale.${type}.more`) }}
        </v-btn>
      </v-col>
      <v-col align="center" cols="12" md="4">
        <v-btn block color="secondary" @click="confirm">
          {{ $t(`prompts.drinkScale.${type}.confirm`) }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';

import type { DrinkwareScaleResponse } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

import { calculateVolume } from './drink-scale';

export default defineComponent({
  name: 'DrinkScalePanel',

  components: { ImagePlaceholder },

  props: {
    maxFillLevel: {
      type: Number,
      default: 1,
    },
    open: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Object as PropType<DrinkwareScaleResponse>,
      required: true,
    },
    type: {
      type: String as PropType<'serving' | 'leftovers'>,
      default: 'serving',
    },
    value: {
      type: Number,
      required: true,
    },
  },

  emits: ['confirm', 'input'],

  setup(props) {
    const imgDrink = ref<InstanceType<typeof VImg>>();
    const sliderMax = ref(props.maxFillLevel * (props.scale.fullLevel - props.scale.emptyLevel));
    const sliderMin = ref(0);
    const sliderStep = ref(Math.round(sliderMax.value / 6));
    const sliderValue = ref(sliderMax.value * props.value);
    const height = ref(0);
    const width = ref(0);

    const isInScale = (y: number) =>
      y >= sliderMin.value + props.scale.emptyLevel &&
      y <= sliderMax.value + props.scale.emptyLevel;

    const cursorInScale = ref(false);

    return {
      imgDrink,
      height,
      width,
      sliderMax,
      sliderMin,
      sliderStep,
      sliderValue,
      isInScale,
      cursorInScale,
    };
  },

  computed: {
    fillLevel(): number {
      return (this.sliderValue / this.sliderMax) * this.maxFillLevel;
    },

    fillVolume(): number {
      return Math.round(calculateVolume(this.scale.volumeSamples, this.fillLevel));
    },

    label(): string {
      return `${this.fillVolume} ml`;
    },

    imgScale() {
      return this.height / this.scale.height;
    },

    sliderHeight() {
      return this.sliderMax * this.imgScale;
    },

    sliderBottom() {
      return `${this.scale.emptyLevel * this.imgScale}px`;
    },

    overlayBackground() {
      return {
        '--clip-path': `inset(${
          this.height - (this.scale.emptyLevel + this.sliderValue) * this.imgScale
        }px 0px 0px 0px)`,
      };
    },
  },

  watch: {
    fillLevel(val) {
      if (!this.open) return;

      this.$emit('input', val);
    },
    open() {
      this.onImgResize();
      this.sliderMax = this.maxFillLevel * (this.scale.fullLevel - this.scale.emptyLevel);
      this.sliderValue = this.sliderMax * this.value;
    },
  },

  created() {
    //@ts-expect-error fix debounced types
    this.debouncedDrinkScaleImgResize = debounce(() => {
      this.updateOverlayDimensions();
    }, 500);

    //@ts-expect-error fix debounced types
    this.debouncedTrackOverlay = debounce((event: MouseEvent) => {
      this.trackOverlay(event);
    }, 100);
  },

  methods: {
    updateOverlayDimensions() {
      const el = this.imgDrink?.$el;
      if (!el) {
        console.warn(`DrinkScalePrompt: could not update IMG dimensions. ${el}`);
        return;
      }

      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },

    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedDrinkScaleImgResize();
    },

    onTrackOverlay(event: MouseEvent) {
      //@ts-expect-error fix debounced types
      this.debouncedTrackOverlay(event);
    },

    touchUpdateSlider(event: MouseEvent) {
      if (event.target && (event.target as HTMLElement).className.startsWith('v-slider__')) return;

      const position = this.scale.height - event.offsetY / this.imgScale;
      if (!this.isInScale(position)) return;

      this.sliderValue = Math.round(position - this.scale.emptyLevel);
    },

    trackOverlay(event: MouseEvent) {
      const position = this.scale.height - event.offsetY / this.imgScale;
      this.cursorInScale = this.isInScale(position);
    },

    updateSlider(value: number) {
      this.sliderValue = Math.min(
        this.sliderMax,
        Math.max(this.sliderMin, this.sliderValue + value)
      );
    },

    confirm() {
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss">
.drink-scale-drawer {
  position: relative;

  &.selected {
    cursor: pointer;
  }

  .drink-scale-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    clip-path: var(--clip-path);
  }

  .drink-scale-image-slider {
    position: absolute;
    right: 0;
    z-index: 1;

    .v-slider {
      height: 100%;

      .v-slider__track-container {
        cursor: pointer;
        width: 20px;
      }

      .v-slider__thumb-container {
        cursor: pointer;

        .v-slider__thumb {
          height: 36px;
          width: 36px;
          left: -18px;
        }

        .v-slider__thumb::before {
          height: 50px;
          width: 50px;
          top: -8px;
          left: -8px;
        }

        &:hover,
        &.v-slider__thumb-container--active,
        &.v-slider__thumb-container--focused {
          .v-slider__thumb::before {
            height: 60px;
            width: 60px;
            top: -12px;
            left: -12px;
          }
        }
      }
    }

    .v-slider--vertical {
      min-height: unset;
    }
  }

  .drink-scale-image-label {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
