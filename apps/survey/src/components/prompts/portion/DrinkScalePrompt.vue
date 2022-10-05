<template>
  <portion-layout v-bind="{ description, text }">
    <template #header>
      {{ localeFoodName }}
    </template>
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat>
          <!-- Step 1: Select guide -->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <i18n path="portion.drinkScale.label">
                <template #food>
                  <span class="font-weight-medium">{{ localeFoodName }}</span>
                </template>
              </i18n>
              <template #actions>
                <valid-invalid-icon :valid="selectedGuide"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <guide-image-panel
                v-if="dataLoaded"
                :guide-image-api-response="guideImageData"
                :selected-index="selectedObjectIdx"
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
              {{ $t('portion.drinkScale.sliderLabel', { food: localeFoodName }) }}
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
                :selected-object-idx="selectedObjectIdx"
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
                    {{ $t('portion.drinkScale.lessFullButton') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn block @click="modifySliderValue(10)">
                    {{ $t('portion.drinkScale.moreFullButton') }}
                  </v-btn>
                </v-col>
                <v-col align="center" md="4" xs="12">
                  <v-btn block color="success" @click="confirmAmount">
                    {{ $t('portion.drinkScale.confirmFullButton') }}
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
        <!-- Should be disabled if nothing selected? -->
        <continue :disabled="!continueEnabled" @click="submit"></continue>
      </v-form>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleState, LocaleTranslation } from '@intake24/common/types';
import type { DrinkScaleParameters } from '@intake24/common/types/http';
import type { DrinkwareSetResponse, ImageMapResponse } from '@intake24/common/types/http/foods';
import { drinkScalePromptDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import {
  DrinkScalePanel,
  GuideImagePanel,
  ValidInvalidIcon,
} from '@intake24/survey/components/elements';

import BasePortion from './BasePortion';

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
  panelOpen: number;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { GuideImagePanel, DrinkScalePanel, ValidInvalidIcon },

  mixins: [BasePortion],

  props: {
    promptProps: {
      type: Object as PropType<DrinkScalePromptProps>,
      required: true,
    },
    //for test
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    parameters: {
      type: Object as PropType<DrinkScaleParameters>,
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
      ...merge(drinkScalePromptDefaultProps, this.promptProps),
      errors: [] as string[],
      drinkwareSetData: {} as DrinkwareSetResponse,
      guideImageData: {} as ImageMapResponse,
      panelOpen: 0, // ID which panel is open
      //First Panel
      selectedGuide: this.initialState.objectConfirmed && selectedIndex !== undefined,
      selectedDrink: this.initialState.drinkConfirmed,
      selectedLeftovers: this.initialState.leftoversConfirmed,
      selectedObjectIdx: selectedIndex ?? 0,
      selectedNodeIdx: null as number | null,
      //Second Panel
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
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    dataLoaded(): boolean {
      return !!Object.keys(this.guideImageData).length;
    },
    isValid() {
      return this.sliderValue > 0;
    },
  },

  async mounted() {
    await this.fetchDrinkScaleData();
  },

  methods: {
    async fetchDrinkScaleData() {
      const dataDrinkwareSet = await this.$http.get<DrinkwareSetResponse>(
        `portion-sizes/drinkware-sets/${this.parameters['drinkware-id']}`
      );

      this.drinkwareSetData = { ...dataDrinkwareSet.data };

      const dataGuideImage = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.drinkwareSetData.guideImageId}`
      );

      this.guideImageData = { ...dataGuideImage.data };
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
        minDrinkSliderValue: this.minFillLevel,
        panelOpen: this.panelOpen,
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
      this.minFillLevel = this.drinkwareSetData.scales[idx].emptyLevel;
      this.sliderValue = this.maxSliderValue - this.maxSliderValue * 0.1;
      this.originalImageUrlHeight = this.drinkwareSetData.scales[idx].height;
      this.originalImageUrlWidth = this.drinkwareSetData.scales[idx].width;

      this.onUpdate();
    },

    dragSlider(value: number) {
      this.sliderValue = value;
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
      this.onUpdate();
    },

    onSelectGuide() {
      this.selectedGuide = true;
      this.panelOpen = 1;
    },

    clearErrors() {
      this.errors = [];
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    confirmAmount() {
      this.selectedDrink = true;
      this.panelOpen = -1;
      this.onUpdate();
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
