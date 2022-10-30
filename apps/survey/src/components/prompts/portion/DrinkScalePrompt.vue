<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <!-- Step 0: Select Volume to measure estimated portion-->
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
          <!-- Step 1: Select Serving Weight ml-->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.serving.header`, { food: localeFoodName }) }}
              <template #actions>
                <drink-scale-volume
                  :valid="quantityConfirmed"
                  :volume="portionSize.servingWeight ?? undefined"
                ></drink-scale-volume>
                <valid-invalid-icon :valid="quantityConfirmed"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  {{ $t(`portion.${portionSize.method}.serving.label`, { food: localeFoodName }) }}
                </v-col>
              </v-row>
              <drink-scale-panel
                v-if="drinkwareSetData && portionSize.containerIndex !== undefined"
                :scale="drinkwareSetData.scales[portionSize.containerIndex]"
                :selected-slider-value="portionSize.fillLevel ?? 75"
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
              <drink-scale-controls
                :portion-size-method="portionSize.method"
                :type="'serving'"
                @confirm-estimate="confirmQuantityOrLeftOvers"
                @modify-slider-value="modifySliderValue"
              >
              </drink-scale-controls>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.leftovers.header`, { food: localeFoodName }) }}
              <template #actions>
                <drink-scale-volume
                  :valid="leftoversConfirmed"
                  :volume="portionSize.leftoversWeight ?? undefined"
                ></drink-scale-volume>
                <valid-invalid-icon
                  :valid="leftoversPrompt !== undefined && leftoversConfirmed"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <!-- Step 2: Select LeftOvers-->
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <p>
                    {{
                      $t(`portion.${portionSize.method}.leftovers.question`, {
                        food: localeFoodName,
                      })
                    }}
                  </p>
                  <v-btn-toggle v-model="leftoversPrompt" color="success" @change="update">
                    <v-btn class="px-4" :value="true">
                      {{ $t('common.action.confirm.yes') }}
                    </v-btn>
                    <v-btn class="px-4" :value="false">
                      {{ $t('common.action.confirm.no') }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <drink-scale-panel
                v-if="
                  drinkwareSetData && portionSize.containerIndex !== undefined && leftoversPrompt
                "
                :scale="drinkwareSetData.scales[portionSize.containerIndex]"
                :selected-slider-value="portionSize.leftoversLevel ?? 75"
                @drink-scale-value="dragLeftOverSlider"
              >
              </drink-scale-panel>
              <v-row v-if="hasErrors">
                <v-col>
                  <v-alert class="ma-0" color="error">
                    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                  </v-alert>
                </v-col>
              </v-row>
              <drink-scale-controls
                :portion-size-method="portionSize.method"
                :type="'leftovers'"
                @confirm-estimate="confirmQuantityOrLeftOvers"
              >
              </drink-scale-controls>
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
import {
  DrinkScaleControls,
  DrinkScalePanel,
  DrinkScaleVolume,
  ImageMapSelector,
} from './selectors';

export interface DrinkScalePromptState {
  portionSize: DrinkScaleState;
  panel: number;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
  leftoversConfirmed: boolean;
  leftoversPrompt?: boolean;
}

export type estimateType = 'serving' | 'leftovers';

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { DrinkScaleControls, DrinkScalePanel, DrinkScaleVolume, ImageMapSelector },

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
    disabledLeftovers() {
      return !this.leftovers;
    },

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
      return this.objectValid && this.quantityValid && this.leftoversValid;
    },
  },

  watch: {
    leftoversPrompt(val) {
      if (val !== false) {
        this.leftoversConfirmed = false;
        this.setPanel(2);
        return;
      }
      this.clearLeftovers();
      this.setPanel(-1);
      this.update();
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

      if (!this.quantityValid) {
        this.setPanel(1);
        return;
      }

      if (!this.leftoversPrompt) {
        this.setPanel(2);
        return;
      }

      this.setPanel(this.leftoversConfirmed || this.leftoversValid ? -1 : 2);
      console.warn('Confirmed: ', this.leftoversConfirmed, ' Valid: ', this.leftoversValid);
    },

    clearLeftovers() {
      this.portionSize.leftovers = false;
      this.portionSize.leftoversWeight = 0;
      this.portionSize.leftoversLevel = 0;
      this.leftoversConfirmed = false;
      this.leftovers = false;
    },

    selectObject(idx: number) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData) return;

      if (idx !== this.portionSize.containerIndex) this.quantityConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.imageUrl = drinkwareSetData.scales[idx].baseImageUrl;
      const fullLevel = drinkwareSetData.scales[idx].fullLevel;
      const emptyLevel = drinkwareSetData.scales[idx].emptyLevel;
      this.portionSize.fillLevel = fullLevel - emptyLevel * 0.1;

      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.updatePanel();
      this.update();
    },

    dragSlider(payload: { scaleValue: number; fillValue: number }) {
      this.portionSize.servingWeight = payload.fillValue;
      this.portionSize.fillLevel = payload.scaleValue;
      this.leftoversPrompt = undefined;
      this.clearLeftovers();
      this.update();
    },

    dragLeftOverSlider(payload: { scaleValue: number; fillValue: number }) {
      this.portionSize.leftoversWeight = payload.fillValue > 0 ? payload.fillValue : 0;
      this.portionSize.leftoversLevel =
        payload.scaleValue < this.portionSize.fillLevel
          ? payload.scaleValue
          : this.portionSize.fillLevel * 0.9;
      this.leftoversConfirmed = true;
      this.update();
    },

    modifySliderValue(payload: { type: estimateType; delta: number }) {
      const { containerIndex } = this.portionSize;
      if (
        containerIndex === undefined ||
        !this.drinkwareSetData ||
        this.portionSize.fillLevel === null
      )
        return;

      // Handle upper and lower bounds, otherwise assign.
      const maxLevel = this.drinkwareSetData.scales[containerIndex].fullLevel;
      this.portionSize.fillLevel = Math.min(
        maxLevel,
        Math.max(0, this.portionSize.fillLevel + payload.delta)
      );

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
        leftoversPrompt: this.leftoversPrompt,
      };

      this.$emit('update', { state, valid: this.isValid });
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
      this.setPanel(2);
      this.update();
    },

    confirmQuantityOrLeftOvers(estimateType: estimateType) {
      if (estimateType === 'leftovers') {
        this.leftoversConfirmed = true;
        this.setPanel(-1);
      } else {
        this.quantityConfirmed = true;
        this.setPanel(2);
      }
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
