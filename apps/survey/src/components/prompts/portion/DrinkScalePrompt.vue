<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <i18n :path="`portion.${portionSize.method}.container`">
                <template #food>
                  <span class="font-weight-medium">{{ localeFoodName }}</span>
                </template>
              </i18n>
              <template #actions>
                <valid-invalid-icon :valid="objectValid"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <image-map-selector
                v-if="imageMapData"
                :image-map-data="imageMapData"
                :value="portionSize.containerIndex"
                @confirm="confirmObject"
                @input="selectObject"
              ></image-map-selector>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.serving.label`, { food: localeFoodName }) }}
              <template #actions>
                <valid-invalid-icon :valid="quantityConfirmed"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <drink-scale-panel
                v-if="drinkwareSetData && portionSize.containerIndex !== undefined"
                :drinkware-set-api-response="drinkwareSetData"
                :selected-image-overlay-url="overlayImageUrl"
                :selected-image-url="portionSize.imageUrl"
                :selected-max-slider-value="fullLevel"
                :selected-min-slider-value="emptyLevel"
                :selected-object-idx="portionSize.containerIndex"
                :selected-origin-image-height="originalImageUrlHeight"
                :selected-origin-image-width="originalImageUrlWidth"
                :selected-slider-value="portionSize.servingWeight ?? 75"
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
                    {{ $t(`portion.${portionSize.method}.serving.less`) }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn block @click="modifySliderValue(10)">
                    {{ $t(`portion.${portionSize.method}.serving.more`) }}
                  </v-btn>
                </v-col>
                <v-col align="center" md="4" xs="12">
                  <v-btn block color="success" @click="confirmQuantity">
                    {{ $t(`portion.${portionSize.method}.serving.confirm`) }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!isValid" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleParameters, DrinkScaleState } from '@intake24/common/types';
import type { DrinkwareSetResponse, ImageMapResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { DrinkScalePanel, ImageMapSelector } from './selectors';

export interface DrinkScalePromptState {
  portionSize: DrinkScaleState;
  panel: number;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
  leftoversConfirmed: boolean;
  overlayImageUrl: string;
  fullLevel: number;
  emptyLevel: number;
  originalImageUrlHeight: number;
  originalImageUrlWidth: number;
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
    const state = copy(this.initialState);
    state.portionSize.drinkwareId = this.parameters['drinkware-id'];
    state.portionSize.initialFillLevel = Number.parseFloat(this.parameters['initial-fill-level']);
    state.portionSize.skipFillLevel = this.parameters['skip-fill-level'] === 'true';

    return {
      ...state,
      drinkwareSetData: null as DrinkwareSetResponse | null,
      imageMapData: null as ImageMapResponse | null,
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    objectValid() {
      return this.portionSize.containerIndex !== undefined && this.objectConfirmed;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    leftoversValid() {
      return this.leftoversConfirmed;
    },

    isValid(): boolean {
      return this.objectValid && this.quantityValid /*&& this.leftoversValid */;
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

    updatePanel() {
      if (this.isValid) {
        this.closePanels();
        return;
      }

      if (!this.objectValid) {
        this.setPanel(0);
        return;
      }

      this.setPanel(this.quantityValid ? -1 : 1);
    },

    selectObject(idx: number) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData) return;

      if (idx !== this.portionSize.containerIndex) this.quantityConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.imageUrl = drinkwareSetData.scales[idx].baseImageUrl;
      this.overlayImageUrl = drinkwareSetData.scales[idx].overlayImageUrl;
      this.fullLevel = drinkwareSetData.scales[idx].fullLevel;
      this.emptyLevel = drinkwareSetData.scales[idx].emptyLevel;
      this.portionSize.servingWeight = this.fullLevel - this.emptyLevel * 0.1;
      this.originalImageUrlHeight = drinkwareSetData.scales[idx].height;
      this.originalImageUrlWidth = drinkwareSetData.scales[idx].width;

      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.updatePanel();
      this.update();
    },

    dragSlider(value: number) {
      this.portionSize.servingWeight = value;

      this.updatePanel();
      this.update();
    },

    modifySliderValue(value: number) {
      const { containerIndex } = this.portionSize;
      if (
        containerIndex === undefined ||
        !this.drinkwareSetData ||
        this.portionSize.servingWeight === null
      )
        return;

      // Handle upper and lower bounds, otherwise assign.
      const maxLevel = this.drinkwareSetData.scales[containerIndex].fullLevel;
      if (this.portionSize.servingWeight + value > maxLevel) {
        this.portionSize.servingWeight = maxLevel;
      } else if (this.portionSize.servingWeight + value < 0) {
        this.portionSize.servingWeight = 0;
      } else {
        this.portionSize.servingWeight += value;
      }

      this.quantityConfirmed = false;

      this.updatePanel();
      this.update();
    },

    update() {
      const state: DrinkScalePromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
        leftoversConfirmed: this.leftoversConfirmed,
        overlayImageUrl: this.overlayImageUrl,
        fullLevel: this.fullLevel,
        emptyLevel: this.emptyLevel,
        originalImageUrlHeight: this.originalImageUrlHeight,
        originalImageUrlWidth: this.originalImageUrlWidth,
      };

      this.$emit('update', { state, valid: this.isValid });
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
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

      console.log('DrinkScale Prompt Completed');
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
