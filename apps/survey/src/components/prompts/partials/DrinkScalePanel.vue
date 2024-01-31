<template>
  <div ref="wrapper" class="drink-scale-wrapper">
    <div
      class="drink-scale-drawer"
      :class="{ selected: cursorInScale }"
      @mousedown="touchUpdateSlider"
      @mousemove="onTrackOverlay($event)"
    >
      <v-img ref="imgDrink" class="drink-scale-image" :src="scale.baseImageUrl" :style="imgVars">
        <template #placeholder>
          <image-placeholder></image-placeholder>
        </template>
      </v-img>
      <v-img class="drink-scale-overlay" :src="scale.overlayImageUrl" :style="overlayVars"> </v-img>
      <div class="drink-scale-slider mr-6" :style="{ bottom: sliderBottom }">
        <v-slider
          v-model="sliderValue"
          color="secondary"
          :height="sliderHeight"
          hide-details
          :label="$t('prompts.quantity._')"
          :max="sliderMax"
          :min="sliderMin"
          thumb-color="secondary"
          vertical
        ></v-slider>
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
          :disabled="sliderValue <= sliderMin"
          outlined
          @click="updateSlider(-sliderStep)"
        >
          <v-icon left>fas fa-circle-down</v-icon>
          {{ $t(`prompts.drinkScale.${type}.less`) }}
        </v-btn>
      </v-col>
      <v-col cols="6" sm>
        <v-btn
          block
          color="primary"
          :disabled="sliderValue >= sliderMax"
          outlined
          @click="updateSlider(sliderStep)"
        >
          <v-icon left>fas fa-circle-up</v-icon>
          {{ $t(`prompts.drinkScale.${type}.more`) }}
        </v-btn>
      </v-col>
      <v-col cols="12" sm>
        <v-btn block color="primary" @click="confirm">
          <v-icon left>$yes</v-icon>
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
import debounce from 'lodash/debounce';
import { computed, defineComponent, ref, watch } from 'vue';

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

  setup(props, { emit }) {
    const wrapper = ref<InstanceType<typeof HTMLFormElement>>();
    const imgDrink = ref<InstanceType<typeof VImg>>();
    //@ts-expect-error should allow vue instance?
    const { height, width } = useElementSize(imgDrink);

    const imgScale = computed(() => height.value / props.scale.height);

    const cursorInScale = ref(false);
    const sliderMax = ref(props.maxFillLevel * (props.scale.fullLevel - props.scale.emptyLevel));
    const sliderMin = ref(0);
    const sliderStep = ref(Math.round(sliderMax.value / 6));
    const sliderValue = ref(sliderMax.value * props.value);
    const sliderBottom = computed(() => `${props.scale.emptyLevel * imgScale.value}px`);
    const sliderHeight = computed(() => sliderMax.value * imgScale.value);

    const isInScale = (y: number) =>
      y >= sliderMin.value + props.scale.emptyLevel &&
      y <= sliderMax.value + props.scale.emptyLevel;

    const updateSlider = (value: number) => {
      sliderValue.value = Math.min(
        sliderMax.value,
        Math.max(sliderMin.value, sliderValue.value + value)
      );
    };

    const touchUpdateSlider = (event: MouseEvent) => {
      if (event.target && (event.target as HTMLElement).className.startsWith('v-slider__')) return;

      const position = props.scale.height - event.offsetY / imgScale.value;
      if (!isInScale(position)) return;

      sliderValue.value = Math.round(position - props.scale.emptyLevel);
    };

    const trackOverlay = (event: MouseEvent) => {
      const position = props.scale.height - event.offsetY / imgScale.value;
      cursorInScale.value = isInScale(position);
    };

    const onTrackOverlay = debounce((event: MouseEvent) => {
      trackOverlay(event);
    }, 100);

    const fillLevel = computed(() => (sliderValue.value / sliderMax.value) * props.maxFillLevel);

    const fillVolume = computed(() =>
      Math.round(calculateVolume(props.scale.volumeSamples, fillLevel.value))
    );

    const label = computed(() => `${fillVolume.value} ml`);

    const imgClip = computed(
      () => (props.scale.height - props.scale.fullLevel) * 0.75 * imgScale.value
    );

    const imgVars = computed(() => ({ '--img-clip': `${imgClip.value}px` }));

    const overlayVars = computed(() => ({
      '--overlay-clip': `${
        height.value - (props.scale.emptyLevel + sliderValue.value) * imgScale.value
      }px`,
    }));

    const confirm = () => {
      emit('confirm');
    };

    watch(fillLevel, (val) => {
      if (!props.open) return;

      emit('input', val);
    });

    watch(
      () => props.open,
      () => {
        sliderMax.value = props.maxFillLevel * (props.scale.fullLevel - props.scale.emptyLevel);
        sliderValue.value = sliderMax.value * props.value;
      }
    );

    return {
      wrapper,
      imgDrink,
      height,
      width,
      confirm,
      imgScale,
      isInScale,
      cursorInScale,
      sliderMax,
      sliderMin,
      sliderStep,
      sliderValue,
      sliderBottom,
      sliderHeight,
      updateSlider,
      touchUpdateSlider,
      onTrackOverlay,
      label,
      imgVars,
      overlayVars,
    };
  },

  watch: {
    height() {
      if (this.open) this.scrollTo();
    },
  },

  methods: {
    scrollTo() {
      setTimeout(async () => {
        if (!this.wrapper) return;

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
    position: relative;
    width: 100%;
    max-width: 600px;

    &.selected {
      cursor: pointer;
    }

    .drink-scale-image {
      clip-path: inset(var(--img-clip) 0px 0px 0px);
      margin-top: calc(var(--img-clip) * -1);
    }

    .drink-scale-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      clip-path: inset(var(--overlay-clip) 0px 0px 0px);
    }

    .drink-scale-slider {
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
          width: 12px;

          .v-slider__track-background {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .v-slider__track-fill {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }

        .v-slider__thumb-container {
          cursor: pointer;

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
}
</style>
