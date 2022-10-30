<template>
  <v-row>
    <v-col>
      <div class="drink-scale-drawer">
        <v-img
          ref="imgDrink"
          v-resize="onImgResize"
          class="drink-scale-image"
          :src="scale.baseImageUrl"
        >
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <v-img
          ref="imgOverlay"
          class="drink-scale-image overlay"
          :height="heightOverlay"
          :src="scale.overlayImageUrl"
          :style="overlayBackground"
          :width="widthOverlay"
        >
        </v-img>
        <v-container class="overlay slider-container">
          <v-row class="drink-slider">
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end mr-auto" sm="1" xs="2">
              <!-- TODO: Height of this -->
              <v-slider
                v-model="sliderValue"
                class="full-height-slider ma-0"
                color="#0d47a1"
                :hint="$t(`portion.drink-scale.serving.less`)"
                :max="scale.fullLevel"
                :min="scale.emptyLevel"
                thumb-color="primary"
                vertical
              ></v-slider>
            </v-col>
          </v-row>
          <v-row class="drink-lable">
            <v-col class="d-flex justify-end mr-auto">
              <v-chip class="ma-2">
                {{ drinkMilliliters }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';

import type { DrinkwareScaleResponse } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

export default defineComponent({
  name: 'DrinkScalePanel',

  components: { ImagePlaceholder },

  props: {
    scale: {
      type: Object as PropType<DrinkwareScaleResponse>,
      required: true,
    },
    selectedSliderValue: {
      type: Number,
      required: true,
    },
  },

  setup() {
    const imgDrink = ref<InstanceType<typeof VImg>>();
    const imgOverlay = ref<InstanceType<typeof VImg>>();

    return { imgDrink, imgOverlay };
  },

  data() {
    const maxFillValue: number = this.scale.volumeSamples.at(-1)?.volume || 100; //FIX Hack since volume can be unidentified;

    return {
      heightOverlay: 0,
      widthOverlay: 0,
      maxSliderValue: this.scale.fullLevel ?? 100,
      minSliderValue: this.scale.emptyLevel ?? 50,
      maxFillValue,
    };
  },

  computed: {
    drinkMilliliters(): string {
      return `${this.fillValue} ml`;
    },
    sliderValue: {
      get() {
        return this.selectedSliderValue;
      },
      set(newValue: number) {
        if (newValue < this.minSliderValue) newValue = this.minSliderValue;
        this.fillValue = Math.round((this.maxFillValue * newValue) / this.maxSliderValue);
        this.$emit('drink-scale-value', { scaleValue: newValue, fillValue: this.fillValue });
      },
    },
    fillValue: {
      get() {
        return this.selectedSliderValue < this.scale.fullLevel
          ? Math.round(
              (this.maxFillValue * this.sliderValue) / this.maxFillValue - this.minSliderValue
            )
          : this.maxFillValue;
      },
      set(newValue: number) {
        this.$emit('drink-fill-value', newValue);
      },
    },

    overlayBackground() {
      return {
        '--clip-path': `inset(${
          this.heightOverlay - (this.heightOverlay * this.sliderValue) / this.scale.height
        }px 0px 0px 0px)`,
      };
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
      this.widthOverlay = width;
      this.heightOverlay = height;
    },

    /*onScaleMove(newValue: number) {
      const overlayBackgroundHeigt =
        this.heightOverlay - (this.heightOverlay * newValue) / this.scale.height;
      return overlayBackgroundHeigt;
    },*/

    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedDrinkScaleImgResize();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../../scss/drinkscale.scss';
</style>
