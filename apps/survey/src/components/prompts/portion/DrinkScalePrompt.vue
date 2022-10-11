<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <!-- Step 1: Select guide -->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <i18n :path="`portion.${method}.container`">
                <template #food>
                  <span class="font-weight-medium">{{ localeFoodName }}</span>
                </template>
              </i18n>
              <template #actions>
                <valid-invalid-icon :valid="objectConfirmed"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <image-map-selector
                v-if="dataLoaded"
                :image-map-data="imageMapData"
                :value="objectIdx"
                @input="selectObject"
              ></image-map-selector>
              <v-row>
                <v-col>
                  <v-btn :block="isMobile" color="success" @click="confirmObject">
                    {{ $t('common.action.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Step 2: Select drink scale amount-->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.serving.label`, { food: localeFoodName }) }}
              <template #actions>
                <valid-invalid-icon :valid="selectedDrink"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <drink-scale-panel
                v-if="dataLoaded"
                :drinkware-set-api-response="drinkwareSetData"
                :selected-image-overlay-url="selectedImageOverlayUrl"
                :selected-image-url="selectionImageUrl"
                :selected-max-slider-value="maxSliderValue"
                :selected-min-slider-value="minFillLevel"
                :selected-object-idx="objectIdx"
                :selected-origin-image-height="originalImageUrlHeight"
                :selected-origin-image-width="originalImageUrlWidth"
                :selected-slider-value="sliderValue"
                @drink-scale-value="dragSlider"
              >
              </drink-scale-panel>
              <v-row v-if="hasErrors">
                <v-col>
                  <v-alert class="ma-0" color="error">
                    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn block @click="modifySliderValue(-10)">
                    {{ $t(`portion.${method}.serving.less`) }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn block @click="modifySliderValue(10)">
                    {{ $t(`portion.${method}.serving.more`) }}
                  </v-btn>
                </v-col>
                <v-col align="center" md="4" xs="12">
                  <v-btn block color="success" @click="confirmAmount">
                    {{ $t(`portion.${method}.serving.confirm`) }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <template #actions>
      <v-form ref="form" @submit.prevent="submit">
        <continue :disabled="!isValid" @click="submit"></continue>
      </v-form>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleParameters, DrinkScaleState } from '@intake24/common/types';
import type { DrinkwareSetResponse, ImageMapResponse } from '@intake24/common/types/http/foods';

import createBasePortion from './createBasePortion';
import { DrinkScalePanel, ImageMapSelector } from './selectors';

export interface DrinkScalePromptState {
  portionSize: DrinkScaleState;
  objectConfirmed: boolean;
  drinkConfirmed: boolean;
  leftoversConfirmed: boolean;
  objectIdx: number | undefined;
  drinkOverlayUrl: string;
  maxDrinkSliderValue: number;
  minDrinkSliderValue: number;
  originalImageUrlHeight: number;
  originalImageUrlWidth: number;
  panel: number;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { DrinkScalePanel, ImageMapSelector },

  mixins: [createBasePortion<DrinkScalePromptProps, DrinkScalePromptState>()],

  props: {
    parameters: {
      type: Object as PropType<DrinkScaleParameters>,
      required: true,
    },
  },

  data() {
    const selectedIndex = this.initialState.portionSize.containerIndex;
    const selectedOverlayImage = this.initialState.drinkOverlayUrl;
    const selectedImage = this.initialState.portionSize.imageUrl;
    const selectedSliderValue = this.initialState.portionSize.servingWeight;
    const selectedMaxSliderValue = this.initialState.maxDrinkSliderValue;
    const selectedMinSliderValue = this.initialState.minDrinkSliderValue;
    const selectedOriginalImageUrlHeight = this.initialState.originalImageUrlHeight;
    const selectedOriginalImageUrlWidth = this.initialState.originalImageUrlWidth;

    return {
      method: 'drink-scale',
      drinkwareSetData: {} as DrinkwareSetResponse,
      imageMapData: {} as ImageMapResponse,
      panel: 0,

      // First Panel
      objectConfirmed: this.initialState.objectConfirmed && selectedIndex !== undefined,
      objectIdx: selectedIndex ? selectedIndex - 1 : undefined,
      selectedDrink: this.initialState.drinkConfirmed,
      selectedLeftovers: this.initialState.leftoversConfirmed,

      // Second Panel
      sliderValue: selectedSliderValue ?? 75,
      maxSliderValue: selectedMaxSliderValue ?? 100,
      minFillLevel: selectedMinSliderValue ?? 0,
      selectionImageUrl: selectedImage ?? '',
      selectedImageOverlayUrl: selectedOverlayImage ?? '',
      originalImageUrlHeight: selectedOriginalImageUrlHeight ?? 0,
      originalImageUrlWidth: selectedOriginalImageUrlWidth ?? 0,
      drinkScaleAmount: false,
    };
  },

  computed: {
    dataLoaded(): boolean {
      return !!Object.keys(this.imageMapData).length;
    },

    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    isValid(): boolean {
      return this.objectIdx !== undefined && this.objectConfirmed && this.selectedDrink;
    },
  },

  async mounted() {
    await this.fetchDrinkScaleData();
  },

  methods: {
    async fetchDrinkScaleData() {
      const { data: drinkwareSetData } = await this.$http.get<DrinkwareSetResponse>(
        `portion-sizes/drinkware-sets/${this.parameters['drinkware-id']}`
      );

      this.drinkwareSetData = { ...drinkwareSetData };

      const { data: imageMapData } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.drinkwareSetData.guideImageId}`
      );

      this.imageMapData = { ...imageMapData };
    },

    update() {
      const portionSizeState = this.getCurrentState(this.objectIdx);

      const update: DrinkScalePromptState = {
        portionSize: portionSizeState,
        objectConfirmed: this.objectConfirmed,
        drinkConfirmed: this.selectedDrink,
        leftoversConfirmed: this.selectedLeftovers,
        objectIdx: this.objectIdx + 1,
        drinkOverlayUrl: this.selectedImageOverlayUrl,
        maxDrinkSliderValue: this.maxSliderValue,
        minDrinkSliderValue: this.minFillLevel,
        panel: this.panel,
        originalImageUrlHeight: this.originalImageUrlHeight,
        originalImageUrlWidth: this.originalImageUrlWidth,
      };
      this.$emit('update', update);
    },

    getCurrentState(idx: number): DrinkScaleState {
      const { 'drinkware-id': drinkwareId, 'initial-fill-level': initialFillLevel } =
        this.parameters;

      return {
        method: 'drink-scale',
        servingWeight: this.sliderValue,
        leftoversWeight: 0, // Guide image does not allow estimating leftovers
        leftoversLevel: 0,
        initialFillLevel: initialFillLevel ?? '0.9',
        fillLevel: parseInt(initialFillLevel) ?? 0,
        skipFillLevel: 'false',
        imageUrl: this.selectionImageUrl,
        drinkwareId: drinkwareId,
        containerIndex: this.objectIdx,
        leftovers: false,
      };
    },

    selectObject(idx: number) {
      if (idx !== this.objectIdx) this.selectedDrink = false;
      this.objectIdx = idx;
      this.selectionImageUrl = this.drinkwareSetData.scales[idx].baseImageUrl;
      this.selectedImageOverlayUrl = this.drinkwareSetData.scales[idx].overlayImageUrl;
      this.maxSliderValue = this.drinkwareSetData.scales[idx].fullLevel;
      this.minFillLevel = this.drinkwareSetData.scales[idx].emptyLevel;
      this.sliderValue = this.maxSliderValue - this.maxSliderValue * 0.1;
      this.originalImageUrlHeight = this.drinkwareSetData.scales[idx].height;
      this.originalImageUrlWidth = this.drinkwareSetData.scales[idx].width;

      this.update();
    },

    dragSlider(value: number) {
      this.sliderValue = value;
      this.update();
    },

    modifySliderValue(value: number) {
      // Handle upper and lower bounds, otherwise assign.
      const maxLevel = this.drinkwareSetData.scales[this.objectIdx].fullLevel;
      if (this.sliderValue + value > maxLevel) {
        this.sliderValue = maxLevel;
      } else if (this.sliderValue + value < 0) {
        this.sliderValue = 0;
      } else {
        this.sliderValue += value;
      }
      this.selectedDrink = false;
      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.setPanel(1);
      this.update();
    },

    confirmAmount() {
      this.selectedDrink = true;
      this.setPanel(-1);
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    submit() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.drinkScaleAmount = true; // This sets the icon on the panel, UI sugar
      console.log('DrinkScale Prompt Completed');
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
