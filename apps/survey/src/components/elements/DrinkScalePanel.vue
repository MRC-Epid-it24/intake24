<template>
  <v-row>
    <v-col>
      <div class="drink-scale-drawer">
        <v-img
          ref="imgDrink"
          v-resize="onImgResize"
          class="drink-scale-image"
          :src="selectedImageUrl.replace('http://localhost:3100', 'https://api.intake24.org')"
        >
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <v-img
          ref="imgOverlay"
          class="drink-scale-image overlay"
          :height="heightOverlay"
          :src="
            selectedImageOverlayUrl.replace('http://localhost:3100', 'https://api.intake24.org')
          "
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
                :max="maxSliderValue"
                :min="minSliderValue"
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

import type { DrinkwareSetResponse } from '@intake24/common/types/http';

import ImagePlaceholder from './ImagePlaceholder.vue';

export default defineComponent({
  name: 'DrinkScalePanel',

  components: { ImagePlaceholder },

  props: {
    drinkwareSetApiResponse: {
      type: Object as PropType<DrinkwareSetResponse>,
      required: true,
    },
    selectedImageUrl: {
      type: String,
      required: true,
    },
    selectedImageOverlayUrl: {
      type: String,
      required: true,
    },
    selectedSliderValue: {
      type: Number,
      required: true,
    },
    selectedMaxSliderValue: {
      type: Number,
      required: true,
    },
    selectedMinSliderValue: {
      type: Number,
      required: true,
    },
    selectedOriginImageHeight: {
      type: Number,
      required: true,
    },
    selectedOriginImageWidth: {
      type: Number,
      required: true,
    },
    selectedObjectIdx: {
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
    const drinkwareSetData = this.drinkwareSetApiResponse;
    const maxFillValue = drinkwareSetData.scales[this.selectedObjectIdx].volumeSamples[9].volume;

    return {
      heightOverlay: 0,
      widthOverlay: 0,
      drinkwareSetData,
      maxSliderValue: this.selectedMaxSliderValue ?? 100,
      minSliderValue: this.selectedMinSliderValue ?? 50,
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
        this.fillValue = Math.round((this.maxFillValue * newValue) / this.maxSliderValue);
        this.$emit('drink-scale-value', newValue);
      },
    },
    fillValue: {
      get() {
        return this.selectedSliderValue < this.selectedMaxSliderValue
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
          this.heightOverlay -
          (this.heightOverlay * this.sliderValue) / this.selectedOriginImageHeight
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
      console.log(`${this.maxSliderValue}`);
    },

    onScaleMove(newValue: number) {
      const overlayBackgroundHeigt =
        this.heightOverlay - (this.heightOverlay * newValue) / this.selectedOriginImageHeight;
      return overlayBackgroundHeigt;
    },

    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedDrinkScaleImgResize();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/drinkscale.scss';
</style>
