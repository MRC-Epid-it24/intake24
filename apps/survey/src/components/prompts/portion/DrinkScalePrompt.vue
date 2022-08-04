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
                <guide-image-panel
                  v-if="dataLoaded"
                  :guide-image-api-response="guideImageData"
                  :selectedIndex="selectedObjectIdx"
                  @guide-object="selectObject"
                ></guide-image-panel>
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
                  <v-icon color="success" v-if="selectedDrink">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedDrink">fas fa-fw fa-exclamation</v-icon>
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
                              :max="maxSliderValue"
                              min="0"
                              vertical
                              color="#0d47a1"
                              thumb-color="primary"
                              @end="onUpdate"
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
                    <v-btn color="success" @click="confirmAmount">
                      {{ $t('portion.drinkScale.confirmFullButton') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row class="ma-2">
        <v-col>
          <v-form ref="form" @submit.prevent="submit">
            <!-- Should be disabled if nothing selected? -->
            <continue @click="submit" :disabled="!continueEnabled" class="px-2"></continue>
          </v-form>
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
import GuideImagePanel from '@intake24/survey/components/elements/GuideImagePanel.vue';
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
  drinkConfirmed: boolean;
  leftoversConfirmed: boolean;
  objectIdx: number | undefined;
  drinkOverlayUrl: string;
  maxDrinkSliderValue: number;
  panelOpen: number;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  mixins: [BasePortion, localeContent],

  components: { ImagePlaceholder, GuideImagePanel },

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
    const selectedIndex = this.initialState.portionSize.containerIndex;
    const selectedOverlayImage = this.initialState.drinkOverlayUrl;
    const selectedImage = this.initialState.portionSize.imageUrl;
    const selectedSliderValue = this.initialState.portionSize.servingWeight;
    const selectedMaxSliderValue = this.initialState.maxDrinkSliderValue;

    return {
      ...merge(drinkScalePromptDefaultProps, this.promptProps),
      errors: [] as string[],
      selectedGuide: this.initialState.objectConfirmed && selectedIndex !== undefined,
      selectedDrink: this.initialState.drinkConfirmed,
      selectedLeftovers: this.initialState.leftoversConfirmed,
      drinkScaleAmount: false,
      selectedObjectIdx: selectedIndex ?? 0,
      selectedNodeIdx: null as number | null,
      selectionImageUrl: selectedImage ?? '',
      selectedImageOverlayUrl: selectedOverlayImage ?? '',
      panelOpen: 0, // ID which panel is open
      // View properties
      sliderValue: selectedSliderValue ?? 75,
      maxSliderValue: selectedMaxSliderValue ?? 100,
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
      return `${this.sliderValue} ml`;
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

    onUpdate() {
      const portionSizeState = this.getCurrentState(this.selectedObjectIdx);

      const update: DrinkScalePromptState = {
        portionSize: portionSizeState,
        objectConfirmed: this.selectedGuide,
        drinkConfirmed: this.selectedDrink,
        leftoversConfirmed: this.selectedLeftovers,
        objectIdx: this.selectedObjectIdx + 1,
        drinkOverlayUrl: this.selectedImageOverlayUrl,
        maxDrinkSliderValue: this.maxSliderValue,
        panelOpen: this.panelOpen,
      };
      this.$emit('update', update);
    },

    getCurrentState(idx: number): DrinkScaleState {
      return {
        method: 'drink-scale',
        servingWeight: this.sliderValue,
        leftoversWeight: 0, // Guide image does not allow estimating leftovers
        leftoversLevel: 0,
        initialFillLevel: this.initialFillLevel ?? '0.9',
        fillLevel: parseInt(this.initialFillLevel) ?? 0,
        skipFillLevel: 'false',
        imageUrl: this.selectionImageUrl,
        drinkwareId: this.drinkwareId,
        containerIndex: this.selectedObjectIdx,
        leftovers: false,
      };
    },

    selectObject(idx: number) {
      if (idx !== this.selectedObjectIdx) this.selectedDrink = false;
      this.selectedObjectIdx = idx;
      this.selectionImageUrl = this.drinkwareSetData.scales[idx].baseImageUrl;
      this.selectedImageOverlayUrl = this.drinkwareSetData.scales[idx].overlayImageUrl;
      this.maxSliderValue = this.drinkwareSetData.scales[idx].fullLevel;
      this.sliderValue = this.maxSliderValue - this.maxSliderValue * 0.1;
      this.onUpdate();
    },

    modifySliderValue(value: number) {
      // Handle upper and lower bounds, otherwise assign.
      const maxLevel = this.drinkwareSetData.scales[this.selectedObjectIdx].fullLevel;
      if (this.sliderValue + value > maxLevel) {
        this.sliderValue = maxLevel;
      } else if (this.sliderValue + value < 0) {
        this.sliderValue = 0;
      } else {
        this.sliderValue += value;
      }
      this.selectedDrink = false;
    },
    onSelectGuide() {
      this.selectedGuide = true;
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.sliderValue > 0) {
        return true;
      }
      return false;
    },

    confirmAmount() {
      this.selectedDrink = true;
      this.panelOpen = -1;
      this.onUpdate();
    },

    submit() {
      if (!this.isValid()) {
        this.errors = [this.$t('portion.drinkScale.validation.required').toString()];
        console.log(`Can't submit DrinkScale`);
        return;
      }
      this.drinkScaleAmount = true; // This sets the icon on the panel, UI sugar
      console.log('DrinkScale Prompt Completed');
      this.$emit('continue');
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
  }
}
</style>
