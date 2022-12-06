<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.typeLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.type"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.type"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: imageMaps.type,
              id: portionSize.type.id,
              index: portionSize.type.index,
            }"
            @confirm="confirmType('type')"
            @select="(idx, id) => selectType('type', idx, id)"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.thicknessLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.thickness"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.thickness"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: imageMaps.thickness,
              id: portionSize.thickness.id,
              index: portionSize.thickness.index,
            }"
            @confirm="confirmType('thickness')"
            @select="(idx, id) => selectType('thickness', idx, id)"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!confirmed.type">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.sizeLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.slice"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.slice"
            v-bind="{
              config: prompt.imageMap,
              disabled: portionSize.slice.index === undefined,
              imageMapData: imageMaps.slice,
              id: portionSize.slice.id,
              index: portionSize.slice.index ? portionSize.slice.index - 1 : undefined,
            }"
            @confirm="confirmType('slice')"
            @select="(idx, id) => selectType('slice', idx + 1, id)"
          >
            <template #label>
              <v-btn
                class="ma-2 font-weight-medium"
                :color="isWholeSelected ? 'info' : ''"
                :dark="isWholeSelected"
                link
                rounded
                :title="$t(`prompts.${type}.whole.confirm`)"
                @click="selectType('slice', 0, '0')"
              >
                {{ $t(`prompts.${type}.whole.confirm`) }}
              </v-btn>
            </template>
          </image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!confirmed.slice">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.${isWholeSelected ? 'whole' : 'slices'}.label`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.quantity"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="portionSize.slice.quantity"
            :confirm.sync="confirmed.quantity"
            @input="selectQuantity"
            @update:confirm="confirmType('quantity', $event)"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PizzaState } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { ImageMapSelector, QuantityCard } from './selectors';

export type PizzaImageMap = 'type' | 'thickness' | 'slice';

export type PizzaPromptState = {
  portionSize: PizzaState;
  panel: number;
  confirmed: {
    type: boolean;
    thickness: boolean;
    slice: boolean;
    quantity: boolean;
  };
};

const thicknessFactors = [
  [0.9, 1.0, 1.1, 1.4, 1.6],
  [1.0, 1.2, 1.3, 1.7, 1.8],
  [0.7, 0.8, 0.8, 1.1, 1.2],
  [0.6, 0.7, 0.8, 1.0, 1.1],
  [1.2, 1.4, 1.5, 2.0, 2.2],
  [0.5, 0.6, 0.7, 0.9, 1.0],
  [0.9, 1.1, 1.2, 1.5, 1.7],
  [0.8, 0.9, 1.0, 1.3, 1.5],
  [1.0, 1.2, 1.3, 1.7, 1.8],
];

const sliceWeights = [
  [335, 167.5, 83.8, 41.9],
  [379, 189.5, 94.8, 47.4],
  [390, 195.0, 97.5, 48.8],
  [162, 81.0, 40.5, 20.3],
  [68, 34.0, 17.0, 8.5],
  [135, 67.5, 33.8],
  [562, 281.0, 140.5, 70.3],
  [288, 144.0, 72.0, 36.0],
  [131, 65.5, 32.8, 16.4],
];

export default defineComponent({
  name: 'PizzaPrompt',

  components: { QuantityCard, ImageMapSelector },

  mixins: [createBasePortion<'pizza-prompt', PizzaPromptState>()],

  data() {
    const typeImageMapId = 'gpizza';
    const thicknessImageMapId = 'gpthick';
    const sliceImageMapPrefix = 'gpiz';

    return {
      thicknessFactors,
      sliceWeights,

      typeImageMapId,
      thicknessImageMapId,
      sliceImageMapPrefix,

      imageMaps: {
        type: null,
        thickness: null,
        slice: null,
      } as Record<PizzaImageMap, ImageMapResponse | null>,

      ...copy(this.initialState),
    };
  },

  computed: {
    imageMapIds(): Record<PizzaImageMap, string> {
      return {
        type: this.typeImageMapId,
        thickness: this.thicknessImageMapId,
        slice: this.sliceImageMapId,
      };
    },

    isWholeSelected(): boolean {
      return this.portionSize.slice.index === 0;
    },

    sliceImageMapId(): string {
      const {
        sliceImageMapPrefix,
        portionSize: {
          type: { id },
        },
      } = this;

      if (id === undefined) return '';

      return `${sliceImageMapPrefix}${id}`;
    },

    typeValid() {
      return (
        this.portionSize.type.id !== undefined &&
        this.portionSize.type.index !== undefined &&
        this.confirmed.type
      );
    },

    thicknessValid() {
      return (
        this.portionSize.thickness.id !== undefined &&
        this.portionSize.thickness.index !== undefined &&
        this.confirmed.thickness
      );
    },

    sliceValid() {
      return (
        this.portionSize.slice.id !== undefined &&
        this.portionSize.slice.index !== undefined &&
        this.confirmed.slice
      );
    },

    quantityValid() {
      return this.confirmed.quantity;
    },

    validConditions(): boolean[] {
      return [this.typeValid, this.thicknessValid, this.sliceValid, this.quantityValid];
    },
  },

  watch: {
    async sliceImageMapId(val) {
      if (!val) return;

      await this.fetchPizzaImageMap('slice');
    },
  },

  async mounted() {
    await Promise.all(
      Object.keys(this.imageMapIds).map((key) => this.fetchPizzaImageMap(key as PizzaImageMap))
    );
  },

  methods: {
    async fetchPizzaImageMap(type: PizzaImageMap) {
      const imageMapId = this.imageMapIds[type];
      if (!imageMapId) return;

      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${imageMapId}`
      );

      this.imageMaps[type] = { ...data };
      this.portionSize[type].image = data.baseImageUrl;
    },

    clearType(type: PizzaImageMap) {
      this.portionSize[type].id = undefined;
      this.portionSize[type].index = undefined;
      this.confirmed[type] = false;
      this.updatePanel();
      this.update();
    },

    selectType(type: PizzaImageMap, idx: number, id: string) {
      this.portionSize[type].index = idx;
      this.portionSize[type].id = id;
      this.confirmed[type] = false;
      this.update();

      if (type === 'type') {
        this.clearType('slice');
        this.confirmType('quantity', false);
      }

      if (type === 'slice') {
        this.confirmType('quantity', false);

        if (!this.isMobile) this.confirmType(type);
      }
    },

    selectQuantity() {
      this.update();
    },

    confirmType(type: PizzaImageMap | 'quantity', value = true) {
      this.confirmed[type] = value;
      this.updatePanel();
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    sliceWeight(type?: number, slice?: number, thickness?: number) {
      if (type === undefined || slice === undefined || thickness === undefined) return 0;

      return sliceWeights[type][slice] * thicknessFactors[type][thickness];
    },

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight =
        this.sliceWeight(
          portionSize.type.index,
          portionSize.slice.index,
          portionSize.thickness.index
        ) * portionSize.slice.quantity;

      const state: PizzaPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        confirmed: this.confirmed,
      };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
