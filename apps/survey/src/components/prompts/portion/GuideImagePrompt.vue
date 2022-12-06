<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`prompts.${type}.label`">
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
            v-bind="{
              config: prompt.imageMap,
              imageMapData: guideImageData.imageMap,
              id: portionSize.objectId,
              index: portionSize.objectIndex,
              sizes,
            }"
            @confirm="confirmObject"
            @select="selectObject"
          >
          </image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!objectValid">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.quantity`, { food: foodName }) }}
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
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

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

  mixins: [createBasePortion<'guide-image-prompt', GuideImagePromptState>()],

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
    sizes() {
      const { guideImageData } = this;
      if (!guideImageData) return [];

      return guideImageData.imageMap.objects.map(
        (object) => `${Math.round(guideImageData.weights[object.id])} g`
      );
    },

    objectValid() {
      return (
        this.portionSize.objectId !== undefined &&
        this.portionSize.objectIndex !== undefined &&
        this.objectConfirmed
      );
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
  },

  methods: {
    async fetchGuideImageData() {
      const { data } = await this.$http.get<GuideImageResponse>(
        `portion-sizes/guide-images/${this.parameters['guide-image-id']}`
      );

      this.guideImageData = { ...data };
      this.portionSize.imageUrl = data.imageMap.baseImageUrl;
    },

    selectObject(idx: number, id: string) {
      this.portionSize.objectIndex = idx;
      this.portionSize.objectId = id;
      this.objectConfirmed = false;
      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;
      this.updatePanel();
      this.update();
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
