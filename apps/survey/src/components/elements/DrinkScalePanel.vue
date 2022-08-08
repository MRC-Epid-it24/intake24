<template>
  <v-row>
    <v-col>
      <div class="drink-scale-drawer">
        <v-img
          ref="imgDrink"
          v-resize="onImgResize"
          :src="selectedImageUrl.replace('http://localhost:3100', 'https://api.intake24.org')"
        >
          <template v-slot:placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <v-img
          ref="imgOverlay"
          :height="heightOverlay"
          :width="widthOverlay"
          class="overlay"
          :src="
            selectedImageOverlayUrl.replace('http://localhost:3100', 'https://api.intake24.org')
          "
        >
        </v-img>
        <v-container class="overlay slider-container">
          <v-row class="drink-slider">
            <v-spacer></v-spacer>
            <v-col xs="2" sm="1" class="d-flex justify-end mr-auto">
              <!-- TODO: Height of this -->
              <v-slider
                class="full-height-slider ma-0"
                v-model="sliderValue"
                :hint="$t('portion.drinkScale.lessFullButton')"
                :max="maxSliderValue"
                min="0"
                vertical
                color="#0d47a1"
                thumb-color="primary"
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
import { Resize } from 'vuetify/lib/directives';

import type { DrinkwareSetResponse } from '@intake24/common/types/http';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';

export default defineComponent({
  name: 'DrinkScalePanel',

  directives: { Resize },

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
  },

  setup() {
    const imgDrink = ref<InstanceType<typeof VImg>>();
    const imgOverlay = ref<InstanceType<typeof VImg>>();

    return { imgDrink, imgOverlay };
  },

  data() {
    const drinkwareSetData = this.drinkwareSetApiResponse;

    return {
      heightOverlay: 0,
      widthOverlay: 0,
      drinkwareSetData,
      maxSliderValue: this.selectedMaxSliderValue ?? 100,
    };
  },

  created() {
    this.debouncedDrinkScaleImgResize = debounce(() => {
      this.updateOverlayDimensions();
    }, 500);
  },

  computed: {
    drinkMilliliters(): string {
      return `${this.sliderValue} ml`;
    },
    sliderValue: {
      get() {
        return this.selectedSliderValue;
      },
      set(newValue: number) {
        this.$emit('drink-scale-value', newValue);
      },
    },
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

    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedDrinkScaleImgResize();
    },
  },
});
</script>

<style lang="scss" scoped>
.drink-slider {
  flex-grow: 1;
  flex-shrink: 0;
}
.drink-lable {
  height: 60px;
  flex-grow: 0;
  margin-top: 2px;
}
.slider-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.drink-scale-drawer {
  position: relative;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.v-input__control :deep(v-input__slot) {
  height: 90% !important;
}
@media only screen and (max-width: 600px) {
  .drink-slider :deep(.v-slider--vertical .v-slider__track-container) {
    left: 80%;
  }
  .drink-slider :deep(.v-slider__thumb-container) {
    left: 80%;
  }
}
</style>
