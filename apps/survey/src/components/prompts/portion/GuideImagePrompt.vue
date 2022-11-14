<template>
  <portion-layout
    v-bind="{ method: portionSize.method, description, text, food, isValid }"
    @nav-action="navAction"
  >
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.label`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="objectValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="guideImageData"
            v-bind="{ sizes }"
            :image-map-data="guideImageData.imageMap"
            :value="portionSize.objectIndex"
            @confirm="confirmObject"
            @input="selectObject"
          >
            <template v-if="isNotDesktop" #label>
              <v-btn
                class="ma-2 font-weight-medium"
                color="grey darken-3"
                dark
                icon
                link
                :title="$t(`portion.${portionSize.method}.expand`)"
                @click="expandImage"
              >
                <v-icon
                  aria-hidden="false"
                  :aria-label="$t(`portion.${portionSize.method}.expand`)"
                >
                  $expandImage
                </v-icon>
              </v-btn>
            </template>
          </image-map-selector>
          <guide-image-selector-mobile
            v-if="guideImageData"
            :height="height"
            :image-map-data="guideImageData?.imageMap"
            :show="showMobileImageContext && isNotDesktop"
            :value="portionSize.objectIndex ?? 0"
            :width="width"
            @confirm="confirmObject"
            @input="selectObject"
          >
          </guide-image-selector-mobile>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.quantity`, { food: foodName }) }}
          <template #actions>
            <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="portionSize.quantity"
            :confirm.sync="quantityConfirmed"
            @input="selectQuantity"
            @update:confirm="confirmQuantity"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!isValid" @click="navAction('next')"></continue>
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
import { GuideImageSelectorMobile, ImageMapSelector, QuantityCard } from './selectors';

export interface GuideImagePromptState {
  portionSize: GuideImageState;
  panel: number;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
}

export default defineComponent({
  name: 'GuideImagePrompt',

  components: { GuideImageSelectorMobile, ImageMapSelector, QuantityCard },

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
      showMobileImageContext: false,
      width: 0,
      height: 0,
    };
  },

  computed: {
    sizes() {
      const { guideImageData } = this;
      if (!guideImageData) return [];

      return guideImageData.imageMap.objects.map(
        (object) => `${Math.round(guideImageData.weights[object.id])} g`
      );
    },

    objectValid() {
      return this.portionSize.objectIndex !== undefined && this.objectConfirmed;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    validConditions(): boolean[] {
      return [this.objectValid, this.quantityValid];
    },
  },

  async mounted() {
    await this.fetchGuideImageData();
    this.getScreenDimensions();
  },

  methods: {
    async fetchGuideImageData() {
      const { data } = await this.$http.get<GuideImageResponse>(
        `portion-sizes/guide-images/${this.parameters['guide-image-id']}`
      );

      this.guideImageData = { ...data };
      this.portionSize.imageUrl = data.imageMap.baseImageUrl;
    },

    getScreenDimensions() {
      const { height, width } = window.screen;
      this.height = height;
      this.width = width;
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
      this.showMobileImageContext = false;
    },

    selectQuantity() {
      this.update();
    },

    confirmQuantity() {
      this.updatePanel();
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    expandImage() {
      this.showMobileImageContext = !this.showMobileImageContext;
    },

    update() {
      if (this.guideImageData && this.portionSize.objectIndex !== undefined) {
        const idx = this.portionSize.objectIndex;

        this.portionSize.objectWeight = this.guideImageData.weights[idx] ?? 0;
        this.portionSize.servingWeight =
          this.guideImageData.weights[idx] * this.portionSize.quantity * this.conversionFactor;
      }

      const state: GuideImagePromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
      };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
