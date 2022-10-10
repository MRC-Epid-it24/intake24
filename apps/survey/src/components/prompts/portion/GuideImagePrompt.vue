<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <!-- Step 1: Select guide -->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <i18n :path="`portion.${method}.label`">
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
                v-if="dataLoaded"
                :image-map-data="guideImageData.imageMap"
                :value="objectIdx"
                @input="selectObject"
              ></image-map-selector>
              <v-row>
                <v-col>
                  <v-btn
                    :block="isMobile"
                    color="success"
                    :disabled="objectIdx === undefined"
                    @click="confirmObject"
                  >
                    {{ $t('common.action.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Step 2: Specify quantity -->
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.quantity`, { food: localeFoodName }) }}
              <template #actions>
                <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row align="center" justify="center">
                <v-col>
                  <quantity-card fraction whole @input="updateQuantity"></quantity-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-alert v-if="hasErrors" color="error">
                    <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                  </v-alert>
                  <v-btn block color="success" @click="confirmQuantity">
                    {{ $t(`portion.${method}.confirm`) }}
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

import type { GuideImagePromptProps, QuantityValues } from '@intake24/common/prompts';
import type { EncodedFood, GuideImageParameters, GuideImageState } from '@intake24/common/types';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';

import createBasePortion from './createBasePortion';
import { ImageMapSelector, QuantityCard } from './selectors';

export interface GuideImagePromptState {
  portionSize: GuideImageState;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
  objectIdx: number | undefined;
  panel: number;
}

export interface GuideImageEncodedFood {
  objectIdx: number | null;
  food: EncodedFood;
  mealId: number | undefined;
  panel: number;
}

export default defineComponent({
  name: 'GuideImagePrompt',

  components: { ImageMapSelector, QuantityCard },

  mixins: [createBasePortion<GuideImagePromptProps, GuideImagePromptState>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    parameters: {
      type: Object as PropType<GuideImageParameters>,
      required: true,
    },
  },

  data() {
    const selectedIndex = this.initialState.portionSize.object?.id;

    return {
      method: 'guide-image',
      guideImageData: {} as GuideImageResponse,
      panel: this.initialState.panel,
      objectConfirmed: this.initialState.objectConfirmed && selectedIndex !== undefined,
      objectIdx: selectedIndex ? selectedIndex - 1 : undefined,
      quantityConfirmed: this.initialState.quantityConfirmed,
      quantityValue: this.initialState.portionSize.quantity,
    };
  },

  computed: {
    dataLoaded() {
      return !!Object.keys(this.guideImageData).length;
    },

    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    objectValid() {
      return this.objectIdx !== undefined && this.objectConfirmed;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },
  },

  async mounted() {
    await this.fetchGuideImageData();
  },

  methods: {
    async fetchGuideImageData() {
      const { data } = await this.$http.get<GuideImageResponse>(
        `portion-sizes/guide-images/${this.parameters['guide-image-id']}`
      );

      this.guideImageData = { ...data };
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

    getCurrentState(idx: number): GuideImageState {
      return {
        method: 'guide-image',
        servingWeight:
          this.guideImageData.weights[idx + 1] *
          (this.quantityValue.whole + this.quantityValue.fraction) *
          this.conversionFactor,
        leftoversWeight: 0,
        object: {
          guideImageId: this.parameters['guide-image-id'],
          imageUrl: this.guideImageData.imageMap.baseImageUrl,
          id: idx + 1,
          weight: this.guideImageData.weights[idx + 1],
        },
        quantity: this.quantityValue,
      };
    },

    selectObject(idx: number) {
      this.objectIdx = idx;
      this.objectConfirmed = false;
      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateQuantity(value: QuantityValues) {
      this.quantityValue = value;
      this.quantityConfirmed = false;
      this.update();
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
      this.updatePanel();
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

      if (this.objectIdx === undefined) throw new Error('Selected object id is null');

      this.$emit('continue');
    },

    update() {
      if (this.objectIdx == null) return;
      const portionSizeState = this.getCurrentState(this.objectIdx);

      const update: GuideImagePromptState = {
        portionSize: portionSizeState,
        objectConfirmed: this.objectConfirmed,
        objectIdx: this.objectIdx + 1,
        quantityConfirmed: this.quantityConfirmed,
        panel: this.panel,
      };
      this.$emit('update', update);
    },
  },
});
</script>

<style lang="scss" scoped></style>
