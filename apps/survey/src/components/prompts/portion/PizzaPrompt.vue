<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.typeLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.pizzaType"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.pizzaType"
            :image-map-data="imageMaps.pizzaType"
            :value="portionSize.pizzaType"
            @confirm="confirmType('pizzaType')"
            @input="selectType('pizzaType', $event)"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.thicknessLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.pizzaThickness"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.pizzaThickness"
            :image-map-data="imageMaps.pizzaThickness"
            :value="portionSize.pizzaThickness"
            @confirm="confirmType('pizzaThickness')"
            @input="selectType('pizzaThickness', $event)"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.sizeLabel`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.sliceType"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMaps.sliceType"
            :disabled="portionSize.sliceType === undefined"
            :image-map-data="imageMaps.sliceType"
            :value="portionSize.sliceType ? portionSize.sliceType - 1 : undefined"
            @confirm="confirmType('sliceType')"
            @input="selectType('sliceType', $event + 1)"
          >
            <template #label>
              <v-btn
                class="ma-2 font-weight-medium"
                :color="isWholeSelected ? 'info' : ''"
                :dark="isWholeSelected"
                link
                rounded
                :title="$t(`portion.${portionSize.method}.whole.confirm`)"
                @click="selectType('sliceType', 0)"
              >
                {{ $t(`portion.${portionSize.method}.whole.confirm`) }}
              </v-btn>
            </template>
          </image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.${isWholeSelected ? 'whole' : 'slices'}.label`) }}
          <template #actions>
            <valid-invalid-icon :valid="confirmed.quantity"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="portionSize.sliceQuantity"
            :confirm.sync="confirmed.quantity"
            @input="selectQuantity"
            @update:confirm="confirmType('quantity', $event)"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!isValid" @click="confirm"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PizzaPromptProps } from '@intake24/common/prompts';
import type { PizzaState } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { ImageMapSelector, QuantityCard } from './selectors';

export type PizzaImageMapType = 'pizzaType' | 'pizzaThickness' | 'sliceType';

export type PizzaPromptState = {
  portionSize: PizzaState;
  panel: number;
  confirmed: {
    pizzaType: boolean;
    pizzaThickness: boolean;
    sliceType: boolean;
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

  mixins: [createBasePortion<PizzaPromptProps, PizzaPromptState>()],

  data() {
    const pizzaImageMapId = 'gpizza';
    const pizzaThicknessImageMapId = 'gpthick';
    const pizzaSliceImageMapPrefix = 'gpiz';

    return {
      thicknessFactors,
      sliceWeights,

      pizzaImageMapId,
      pizzaThicknessImageMapId,
      pizzaSliceImageMapPrefix,

      imageMaps: {
        pizzaType: null,
        pizzaThickness: null,
        sliceType: null,
      } as Record<PizzaImageMapType, ImageMapResponse | null>,

      ...copy(this.initialState),
    };
  },

  computed: {
    imageMapIds(): Record<PizzaImageMapType, string> {
      return {
        pizzaType: this.pizzaImageMapId,
        pizzaThickness: this.pizzaThicknessImageMapId,
        sliceType: this.pizzaSliceImageMapId,
      };
    },

    isWholeSelected(): boolean {
      return this.portionSize.sliceType === 0;
    },

    pizzaSliceImageMapId(): string {
      const {
        pizzaSliceImageMapPrefix,
        portionSize: { pizzaType },
      } = this;

      if (pizzaType === undefined) return '';

      return `${pizzaSliceImageMapPrefix}${pizzaType + 1}`;
    },

    typeValid() {
      return this.portionSize.pizzaType !== undefined && this.confirmed.pizzaType;
    },

    thicknessValid() {
      return this.portionSize.pizzaThickness !== undefined && this.confirmed.pizzaThickness;
    },

    sliceValid() {
      return this.confirmed.sliceType;
    },

    quantityValid() {
      return this.confirmed.quantity;
    },

    validConditions(): boolean[] {
      return [this.typeValid, this.thicknessValid, this.sliceValid, this.quantityValid];
    },
  },

  watch: {
    async pizzaSliceImageMapId(val) {
      if (!val) return;

      await this.fetchPizzaImageMap('sliceType');
    },
  },

  async mounted() {
    await Promise.all(
      Object.keys(this.imageMapIds).map((key) => this.fetchPizzaImageMap(key as PizzaImageMapType))
    );
  },

  methods: {
    async fetchPizzaImageMap(type: PizzaImageMapType) {
      const imageMapId = this.imageMapIds[type];
      if (!imageMapId) return;

      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${imageMapId}`
      );

      this.imageMaps[type] = { ...data };
    },

    clearType(type: PizzaImageMapType) {
      this.portionSize[type] = undefined;
      this.confirmed[type] = false;
      this.updatePanel();
      this.update();
    },

    selectType(type: PizzaImageMapType, idx: number) {
      this.portionSize[type] = idx;
      this.confirmed[type] = false;
      this.update();

      if (type === 'pizzaType') {
        this.clearType('sliceType');
        this.confirmType('quantity', false);
      }

      if (type === 'sliceType' && !this.isMobile) this.confirmType(type);
    },

    selectQuantity() {
      this.update();
    },

    confirmType(type: PizzaImageMapType | 'quantity', value = true) {
      this.confirmed[type] = value;
      this.updatePanel();
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    confirm() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('confirm');
    },

    sliceWeight(pizzaType?: number, sliceType?: number, thickness?: number) {
      if (pizzaType === undefined || sliceType === undefined || thickness === undefined) return 0;

      return sliceWeights[pizzaType][sliceType] * thicknessFactors[pizzaType][thickness];
    },

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight =
        this.sliceWeight(portionSize.pizzaType, portionSize.sliceType, portionSize.pizzaThickness) *
        portionSize.sliceQuantity;

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
