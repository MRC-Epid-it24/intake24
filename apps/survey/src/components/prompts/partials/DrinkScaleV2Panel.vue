<template>
  <div ref="wrapper" class="drink-scale-wrapper">
    <div class="drink-scale-drawer" :class="{ selected: cursorInScale }">
      <v-img
        ref="imgDrink"
        class="drink-scale-image"
        :src="scale.baseImageUrl"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @touchmove="onTouchMove"
      >
        <template #placeholder>
          <image-placeholder />
        </template>
      </v-img>

      <svg>
        <filter id="drink-scale-blur">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="drink-scale-clip">
          <rect
            :height="scaleBoundsPx.bottom - sliderPosPx"
            width="100%"
            x="0"
            :y="sliderPosPx"
          />
        </clipPath>
        <polygon
          class="drink-scale-polygon"
          clip-path="url(#drink-scale-clip)"
          filter="url(#drink-scale-blur)"
          :points="outlinePoints"
        />
      </svg>

      <div class="drink-scale-slider mr-6" :style="{ bottom: sliderBottomOffset }">
        <v-slider
          v-model="sliderValue"
          color="secondary"
          :height="scaleHeightPx"
          hide-details
          :label="$t('prompts.quantity._')"
          :max="1"
          :min="0"
          :step="0.01"
          thumb-color="secondary"
          vertical
        />
      </div>
      <div class="drink-scale-label">
        <v-chip
          class="ma-1 ma-md-2 pa-3 pa-md-4 text-h6 font-weight-bold secondary--text border-secondary-1"
        >
          {{ label }}
        </v-chip>
      </div>
    </div>
    <v-row class="drink-scale-controls">
      <v-col cols="6" sm>
        <v-btn
          block
          color="primary"
          :disabled="sliderValue === 0"
          outlined
          @click="moveSliderRelative(-0.2)"
        >
          <v-icon left>
            fas fa-circle-down
          </v-icon>
          {{ $t(`prompts.drinkScale.${type}.less`) }}
        </v-btn>
      </v-col>
      <v-col cols="6" sm>
        <v-btn
          block
          color="primary"
          :disabled="sliderValue === 1"
          outlined
          @click="moveSliderRelative(0.2)"
        >
          <v-icon left>
            fas fa-circle-up
          </v-icon>
          {{ $t(`prompts.drinkScale.${type}.more`) }}
        </v-btn>
      </v-col>
      <v-col cols="12" sm>
        <v-btn block color="primary" @click="confirm">
          <v-icon left>
            $yes
          </v-icon>
          {{ $t(`prompts.drinkScale.${type}.confirm`) }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import { useElementSize } from '@vueuse/core';
import { chunk, maxBy } from 'lodash';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';

import type { DrinkwareScaleV2Response } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

import { calculateVolume, getScaleBounds, toSvgPolygonPoints } from './drink-scale';
import { calculateFillVolume, getSymmetryShape } from './drink-scale-cylindrical';

export default defineComponent({
  name: 'DrinkScaleV2Panel',

  components: { ImagePlaceholder },

  props: {
    maxFillLevel: {
      type: Number,
      default: 1,
    },
    cylindricalVolumeStep: {
      type: Number,
      required: false,
      default: 0.05,
    },
    open: {
      type: Boolean,
      default: false,
    },
    scale: {
      type: Object as PropType<DrinkwareScaleV2Response>,
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

  setup(props, { emit }) {
    const wrapper = ref<InstanceType<typeof HTMLFormElement>>();
    const imgDrink = ref<InstanceType<typeof VImg>>();
    // @ts-expect-error should allow vue instance?
    const { height, width } = useElementSize(imgDrink);

    // Outline coordinates converted into a format compatible with the svg polygon's points attribute
    const outlinePoints = computed(() =>
      toSvgPolygonPoints(props.scale.outlineCoordinates, width.value, height.value),
    );

    const propRefs = toRefs(props);

    const scaleBounds = computed(() => getScaleBounds(propRefs.scale.value.outlineCoordinates));

    const symmetryShape = computed(() => getSymmetryShape(propRefs.scale.value.outlineCoordinates));

    // The bounding box of the sliding scale (full region not accounting for maxFillLevel)
    const scaleBoundsPx = computed(() => {
      const bounds = scaleBounds.value;
      const w = width.value;
      const h = height.value;
      return {
        left: bounds.minX * w,
        right: bounds.maxX * w,
        top: bounds.minY * h,
        bottom: bounds.maxY * h,
      };
    });

    const sliderValue = ref(props.value);

    // Height of the usable sliding scale region in pixels with max fill limit applied.
    const scaleHeightPx = computed(
      () => (scaleBoundsPx.value.bottom - scaleBoundsPx.value.top) * props.maxFillLevel,
    );

    // Vertical offset to the current slider position in pixels. Slider range is fixed to [0, 1]
    // regardless of component properties.
    const sliderPosPx = computed(
      () => scaleBoundsPx.value.bottom - scaleHeightPx.value * sliderValue.value,
    );

    // Vertical offset from the bottom of the image to the start of the sliding scale region in pixels.
    // Used to position the slider element.
    const sliderBottomOffset = computed(() => `${height.value - scaleBoundsPx.value.bottom}px`);

    const isInScale = (x: number, y: number) => {
      const bounds = scaleBoundsPx.value;
      const yRel = bounds.bottom - y;
      return yRel >= 0 && yRel <= scaleHeightPx.value && x >= bounds.left && x <= bounds.right;
    };

    const cursorInScale = ref(false);

    // Move the slider by delta % (can be negative). Used by the 'I had more'/'I had less' buttons.
    const moveSliderRelative = (delta: number) => {
      sliderValue.value = Math.min(1, Math.max(0, sliderValue.value + delta));
    };

    // Move the slider to a specific position. Used by onClick/onMove events to allow moving the slider
    // by interacting with the image (outside of the slider).
    const moveSlider = (y: number) => {
      const yRel = scaleBoundsPx.value.bottom - y;
      const clamped = Math.max(0, Math.min(scaleHeightPx.value, yRel));
      sliderValue.value = clamped / scaleHeightPx.value;
    };

    const onMouseMove = (event: MouseEvent) => {
      const inScale = isInScale(event.offsetX, event.offsetY);

      cursorInScale.value = inScale;

      if (inScale && event.buttons & 1)
        moveSlider(event.offsetY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.target && event.target instanceof HTMLElement && event.targetTouches.length > 0) {
        const clientRect = event.target.getBoundingClientRect();
        const offsetX = event.targetTouches[0].clientX - clientRect.x;
        const offsetY = event.targetTouches[0].clientY - clientRect.y;

        // If the touch is inside the sliding scale region, move the slider instead of scrolling.
        // Usability is questionable, but seems to feel OK on an actual touch device. Needs wider testing.
        if (isInScale(offsetX, offsetY)) {
          moveSlider(offsetY);
          event.preventDefault();
        }
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.target && (event.target as HTMLElement).className.startsWith('v-slider__'))
        return;
      moveSlider(event.offsetY);
    };

    const fillLevel = computed(() => sliderValue.value * props.maxFillLevel);

    const maxVolume = computed(() => (maxBy(chunk(propRefs.scale.value.volumeSamplesNormalised, 2), sample => sample[1]) || [0, 0])[1]);

    // eslint-disable-next-line vue/return-in-computed-property
    const fillVolume = computed(() => {
      switch (propRefs.scale.value.volumeMethod) {
        case 'lookUpTable':
          return Math.round(calculateVolume(props.scale.volumeSamplesNormalised, fillLevel.value));
        case 'cylindrical': {
          const { minY, maxY } = scaleBounds.value;
          const scaleHeight = maxY - minY;
          const fillLineY = maxY - scaleHeight * fillLevel.value;
          const fullVolume = calculateFillVolume(symmetryShape.value, minY, propRefs.cylindricalVolumeStep.value);
          const filledVolume = calculateFillVolume(symmetryShape.value, fillLineY, propRefs.cylindricalVolumeStep.value);
          return Math.round((filledVolume * maxVolume.value) / fullVolume);
        }
      }
    });

    const label = computed(() => `${fillVolume.value} ml`);

    const confirm = () => {
      emit('confirm');
    };

    watch(fillLevel, (val) => {
      if (!props.open)
        return;

      emit('input', val);
    });

    watch(
      () => props.open,
      () => {
        sliderValue.value = props.value / props.maxFillLevel; // Slider values are always in the range [0, 1]
      },
    );

    return {
      wrapper,
      imgDrink,
      height,
      width,
      confirm,
      isInScale,
      cursorInScale,
      sliderValue,
      scaleBoundsPx,
      scaleHeightPx,
      sliderPosPx,
      sliderBottomOffset,
      moveSliderRelative,
      onMouseDown,
      onMouseMove,
      onTouchMove,
      label,
      outlinePoints,
    };
  },

  watch: {
    height() {
      if (this.open)
        this.scrollTo();
    },
  },

  methods: {
    scrollTo() {
      setTimeout(async () => {
        if (!this.wrapper)
          return;

        await this.$vuetify.goTo(this.wrapper);
      }, 100);
    },
  },
});
</script>

<style lang="scss">
@import 'src/scss/variables';

.drink-scale-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .drink-scale-drawer {
    pointer-events: none;
    position: relative;
    width: 100%;
    max-width: 600px;

    &.selected {
      cursor: pointer;
    }

    .drink-scale-image {
      pointer-events: auto;
    }

    .drink-scale-slider {
      pointer-events: auto;
      position: absolute;
      right: 0;
      z-index: 1;

      // Only for WCAG - vuetify should be able to do this
      label {
        display: none;
      }

      .v-slider {
        height: 100%;

        .v-slider__track-container {
          cursor: pointer;
          width: 10px;

          .v-slider__track-background {
            transition: none !important;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .v-slider__track-fill {
            transition: none !important;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }

        .v-slider__thumb-container {
          cursor: pointer;
          // CSS transitions make the slider very laggy
          transition: none !important;

          .v-slider__thumb {
            width: 30px;
            height: 14px;
            position: absolute;
            left: -14px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: -3.5px;
              width: 0;
              height: 0;
              border-right: 7px solid $secondary;
              border-top: 7px solid transparent;
              border-bottom: 7px solid transparent;
            }

            &::before {
              content: unset;
            }
          }
        }
      }

      .v-slider--vertical {
        min-height: unset;
      }
    }

    .drink-scale-label {
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;
    }
  }

  .drink-scale-controls {
    width: 100%;
    max-width: 600px;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .drink-scale-polygon {
      cursor: pointer;

      stroke-width: 8;
      stroke: $sliding_scale_color;
      stroke-opacity: $sliding_scale_opacity;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: $sliding_scale_color;
      fill-opacity: $sliding_scale_opacity;
    }
  }
}
</style>
