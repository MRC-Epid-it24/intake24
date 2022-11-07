<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="drink-scale-drawer" @mousedown="touchUpdateSlider">
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
          <div class="drink-scale-image-slider mx-5" :style="{ bottom: sliderBottom }">
            <v-slider
              v-model="sliderValue"
              color="blue darken-4"
              :height="sliderHeight"
              :max="sliderMax"
              :min="sliderMin"
              thumb-color="primary"
              vertical
            ></v-slider>
          </div>
          <div class="drink-scale-image-label">
            <v-chip class="ma-2 font-weight-medium">{{ label }}</v-chip>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block :disabled="sliderValue <= sliderMin" @click="updateSlider(-10)">
          {{ $t(`portion.drink-scale.${type}.less`) }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn block :disabled="sliderValue >= sliderMax" @click="updateSlider(10)">
          {{ $t(`portion.drink-scale.${type}.more`) }}
        </v-btn>
      </v-col>
      <v-col align="center" md="4" xs="12">
        <v-btn block color="success" @click="confirm">
          {{ $t(`portion.as-served.${type}.confirm`) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
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

  setup(props) {
    const imgDrink = ref<InstanceType<typeof VImg>>();
    const sliderMax = ref(props.maxFillLevel * (props.scale.fullLevel - props.scale.emptyLevel));
    const sliderMin = ref(0);
    const sliderValue = ref(sliderMax.value * props.value);
    const height = ref(0);
    const width = ref(0);

    return {
      imgDrink,
      height,
      width,
      sliderMax,
      sliderMin,
      sliderValue,
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
    this.debouncedDrinkScaleImgResize = debounce(() => {
      this.updateOverlayDimensions();
    }, 500);
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

    touchUpdateSlider(event: MouseEvent) {
      const position = this.scale.height - event.offsetY / this.imgScale;

      if (event.path[0].className.startsWith('v-slider__')) return;

      if (
        position > this.sliderMax + this.scale.emptyLevel ||
        position < this.sliderMin + this.scale.emptyLevel
      )
        return;

      this.sliderValue = Math.round(position - this.scale.emptyLevel);
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
  }

  .drink-scale-image-label {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  .v-slider {
    height: 100%;

    .v-slider__track-container {
      width: 5px;
    }
  }
}
</style>
