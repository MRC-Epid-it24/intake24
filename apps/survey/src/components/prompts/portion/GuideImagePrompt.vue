<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              <i18n :path="`portion.${portionSize.method}.label`">
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
                v-if="guideImageData"
                :image-map-data="guideImageData.imageMap"
                :value="portionSize.objectIndex"
                @input="selectObject"
              ></image-map-selector>
              <v-row>
                <v-col>
                  <v-btn
                    :block="isMobile"
                    color="success"
                    :disabled="portionSize.objectIndex === undefined"
                    @click="confirmObject"
                  >
                    {{ $t('common.action.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.quantity`, { food: localeFoodName }) }}
              <template #actions>
                <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="center">
                <v-col>
                  <quantity-card v-model="portionSize.quantity" fraction whole></quantity-card>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col md="4" xs="12">
                  <v-btn block color="success" @click="confirmQuantity">
                    {{ $t(`portion.${portionSize.method}.confirm`) }}
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

import type { GuideImagePromptProps } from '@intake24/common/prompts';
import type { GuideImageParameters, GuideImageState } from '@intake24/common/types';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { ImageMapSelector, QuantityCard } from './selectors';

export interface GuideImagePromptState {
  portionSize: GuideImageState;
  panel: number;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
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
    const state = copy(this.initialState);
    state.portionSize.guideImageId = this.parameters['guide-image-id'];

    return {
      guideImageData: null as GuideImageResponse | null,
      ...state,
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    objectValid() {
      return this.portionSize.objectIndex !== undefined && this.objectConfirmed;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    isValid() {
      return this.objectValid && this.quantityValid;
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
      this.portionSize.imageUrl = data.imageMap.baseImageUrl;
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
      this.portionSize.objectIndex = idx;
      this.objectConfirmed = false;
      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.updatePanel();
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

      this.$emit('continue');
    },

    update() {
      if (this.guideImageData && this.portionSize.objectIndex !== undefined) {
        const idx = this.portionSize.objectIndex;

        this.portionSize.objectWeight = this.guideImageData.weights[idx] ?? 0;
        this.portionSize.servingWeight =
          this.guideImageData.weights[idx] *
          (this.portionSize.quantity.whole + this.portionSize.quantity.fraction) *
          this.conversionFactor;
      }

      const state: GuideImagePromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
      };

      this.$emit('update', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
