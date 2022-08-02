<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen" flat>
            <!-- Step 1: Select guide -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.drinkScale.label', { food: localeDescription }) }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedGuide">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedGuide">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <div class="guides-drawer" v-if="dataLoaded">
                      <v-img
                        ref="imgGuide"
                        v-resize="onImgResize"
                        :src="
                          guideImageData.imageMap.baseImageUrl.replace(
                            'http://localhost:3100',
                            'https://api.intake24.org'
                          )
                        "
                      >
                        <template v-slot:placeholder>
                          <image-placeholder></image-placeholder>
                        </template>
                      </v-img>
                      <svg ref="svg" :height="height" :width="width">
                        <polygon
                          v-for="(polygon, idx) in polygons"
                          :key="idx"
                          class="guides-drawer-polygon"
                          :class="{ active: idx === selectedObjectIdx }"
                          :points="polygon"
                          @click.stop="selectObject(idx)"
                          @keypress.stop="selectObject(idx)"
                        ></polygon>
                      </svg>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn color="success" @click="onSelectGuide()">
                      {{ $t('common.action.continue') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Step 2: Select drink scale amount-->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.drinkScale.sliderLabel', { food: localeDescription }) }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="drinkScaleAmount">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!drinkScaleAmount">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <div class="drink-scale-drawer" v-if="dataLoaded">
                      <v-img
                        ref="imgDrink"
                        v-resize="onImgResize"
                        :src="
                          selectionImageUrl.replace(
                            'http://localhost:3100',
                            'https://api.intake24.org'
                          )
                        "
                      >
                        <template v-slot:placeholder>
                          <image-placeholder></image-placeholder>
                        </template>
                      </v-img>
                      <v-img
                        ref="imgOverlay"
                        :height="heightOverlay"
                        :width="widthOverlay"
                        class="overlay align-end"
                        :src="
                          selectedImageOverlayUrl.replace(
                            'http://localhost:3100',
                            'https://api.intake24.org'
                          )
                        "
                      >
                        <v-row class="drink-slider">
                          <v-spacer></v-spacer>
                          <v-col xs="2" sm="1" class="d-flex justify-end mr-auto">
                            <!-- TODO: Height of this -->
                            <v-slider
                              class="full-height-slider ma-0"
                              v-model="sliderValue"
                              :hint="$t('portion.drinkScale.lessFullButton')"
                              max="100"
                              min="0"
                              vertical
                            ></v-slider>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="d-flex justify-end mr-auto">
                            <v-chip class="ma-2">
                              {{ drinkMilliliters }}
                            </v-chip>
                          </v-col>
                        </v-row>
                      </v-img>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-if="hasErrors">
                  <v-col>
                    <v-alert color="error" class="ma-0">
                      <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn @click="modifySliderValue(-10)">
                      {{ $t('portion.drinkScale.lessFullButton') }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn @click="modifySliderValue(10)">
                      {{ $t('portion.drinkScale.moreFullButton') }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn color="success" @click="submit()">
                      {{ $t('portion.drinkScale.confirmFullButton') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card></v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType, Ref } from 'vue';
import type { VImg } from 'vuetify/lib';
import { Resize } from 'vuetify/lib/directives';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';
import debounce from 'lodash/debounce';
import chunk from 'lodash/chunk';
import { merge } from '@intake24/common/util';
import type { DrinkScalePromptProps } from '@intake24/common/prompts';
import { drinkScalePromptDefaultProps } from '@intake24/common/prompts';
import type { DrinkwareSetResponse, GuideImageResponse } from '@intake24/common/types/http/foods';
import type { LocaleTranslation, DrinkScaleState } from '@intake24/common/types';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion from './BasePortion';

export interface DrinkScalePromptState {
  portionSize: DrinkScaleState;
  objectConfirmed: boolean;
  drinkScaleAmount: boolean;
  objectIdx: number | undefined;
  panelOpen: number;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  mixins: [BasePortion, localeContent],

  components: { ImagePlaceholder },

  directives: { Resize },

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<DrinkScalePromptProps>,
      required: true,
    },
    //for test
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    drinkwareId: {
      type: String,
      required: true,
    },
    skipFillLevel: {
      type: String,
      required: true,
    },
    initialFillLevel: {
      type: String,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    initialState: {
      type: Object as PropType<DrinkScalePromptState>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const imgGuide = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();
    const imgDrink = ref<InstanceType<typeof VImg>>();
    const imgOverlay = ref<InstanceType<typeof VImg>>();

    return { imgGuide, svg, imgDrink, imgOverlay };
  },

  data() {
    const selectedIndex = this.initialState.portionSize.object?.id;

    return {
      ...merge(drinkScalePromptDefaultProps, this.promptProps),
      errors: [] as string[],
      selectedGuide: this.initialState.objectConfirmed && selectedIndex !== undefined,
      drinkScaleAmount: false,
      selectedObjectIdx: selectedIndex !== undefined ? selectedIndex - 1 : 0,
      selectedNodeIdx: null as number | null,
      selectionImageUrl: '',
      selectedImageOverlayUrl: '',
      // quantityValue: this.initialState.portionSize.quantity,
      panelOpen: 0, // ID which panel is open
      sliderValue: 75,
      drinkwareSetData: {} as DrinkwareSetResponse,
      guideImageData: {} as GuideImageResponse,
      width: 0,
      height: 0,
      widthOverlay: 0,
      heightOverlay: 0,
    };
  },

  created() {
    this.debouncedGuideImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
    this.debouncedDrinkScaleImgResize = debounce(() => {
      this.updateOverlayDimensions();
    }, 500);
  },

  mounted() {
    this.fetchGuideImageData();
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    drinkMilliliters(): string {
      return `${this.sliderValue}ml`;
    },
    dataLoaded(): boolean {
      return !!Object.keys(this.guideImageData).length;
    },
    polygons(): string[] {
      if (!this.dataLoaded) return [];

      const { width } = this;

      return this.guideImageData.imageMap.objects.map((object) => {
        return chunk(
          object.outline.map((coord) => coord * width),
          2
        )
          .map((node) => node.join(','))
          .join(' ');
      });
    },
  },

  methods: {
    async fetchGuideImageData() {
      const dataDrinkwareSet = await this.$http.get<DrinkwareSetResponse>(
        `portion-sizes/drinkware-sets/${this.drinkwareId}`
      );

      this.drinkwareSetData = { ...dataDrinkwareSet.data };

      const dataGuideImage = await this.$http.get<GuideImageResponse>(
        `portion-sizes/guide-images/${this.drinkwareSetData.guideImageId}`
      );

      this.guideImageData = { ...dataGuideImage.data };
    },

    updateSvgDimensions() {
      const el = this.imgGuide?.$el;
      if (!el) {
        console.warn(`GuideImagePrompt: could not update SVG dimensions.`);
        return;
      }
      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },

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

    onImgResize(imgRef: string) {
      //@ts-expect-error fix debounced types
      this.debouncedGuideImgResize();

      //@ts-expect-error fix debounced types
      this.debouncedDrinkScaleImgResize();
    },

    // drinkScalePolygons(selectedObjectIdx: number): string[] {
    //   if (!this.dataLoaded) return [];

    //   const { width } = this;

    //   return this.drinkwareSetData.scales.imageMap.objects.map((object) => {
    //     return chunk(
    //       object.outline.map((coord) => coord * width),
    //       2
    //     )
    //       .map((node) => node.join(','))
    //       .join(' ');
    //   });
    // },

    onUpdate() {
      const portionSizeState = this.getCurrentState(this.selectedObjectIdx);

      const update: DrinkScalePromptState = {
        portionSize: portionSizeState,
        objectConfirmed: this.selectedGuide,
        drinkScaleAmount: this.drinkScaleAmount,
        objectIdx: this.selectedObjectIdx + 1,
        panelOpen: this.panelOpen,
      };
      this.$emit('update', update);
    },

    getCurrentState(idx: number): DrinkScaleState {
      return {
        method: 'drink-scale',
        servingWeight: 60,
        leftoversWeight: 0, // Guide image does not allow estimating leftovers
        object: {
          id: idx + 1,
          weight: 61,
        },
        leftoversLevel: 0,
        initialFillLevel: '0.9',
        fillLevel: 0,
        skipFillLevel: 'false',
        imageUrl: this.selectionImageUrl,
        drinkwareId: this.drinkwareId,
        containerIndex: this.selectedObjectIdx,
        leftovers: false,
      };
    },

    selectObject(idx: number) {
      this.selectedObjectIdx = idx;
      this.selectionImageUrl = this.drinkwareSetData.scales[idx].baseImageUrl;
      this.selectedImageOverlayUrl = this.drinkwareSetData.scales[idx].overlayImageUrl;
      this.onUpdate();
    },

    modifySliderValue(value: number) {
      // Handle upper and lower bounds, otherwise assign.
      if (this.sliderValue + value > 100) {
        this.sliderValue = 100;
      } else if (this.sliderValue + value < 0) {
        this.sliderValue = 0;
      } else {
        this.sliderValue += value;
      }
    },
    onSelectGuide() {
      this.selectedGuide = !this.selectedGuide;
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.selectedGuide) {
        return true;
      }
      return false;
    },
    submit() {
      if (!this.isValid()) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            this.$t('portion.guideImage.validation.required').toString(),
        ];
        return;
      }
      this.$emit('DrinkScale completed');
      this.drinkScaleAmount = true; // This sets the icon on the panel, UI sugar
      this.panelOpen = -1; // Close panels if no errors
    },
  },
});
</script>

<style lang="scss" scoped>
.drink-slider {
  height: 100%;
}
.guides-drawer {
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;

    .guides-drawer-polygon {
      cursor: pointer;
      fill: transparent;

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}

.drink-scale-drawer {
  position: relative;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;

    .drink-scale-drawer-overlay {
      cursor: pointer;
      fill: transparent;

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}
</style>
