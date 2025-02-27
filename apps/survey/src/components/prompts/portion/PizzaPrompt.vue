<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel :readonly="portionSizeMethods.length === 1">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.method`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="psmValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <portion-size-methods
            v-bind="{ foodName, modelValue: food.portionSizeMethodIndex, portionSizeMethods }"
            @update:model-value="action('changeMethod', $event)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.typeLabel`) }}
          <template #actions>
            <expansion-panel-actions :valid="confirmed.type" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <image-map-selector
            v-if="imageMaps.type"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: imageMaps.type,
              id: portionSize.type.id,
              index: portionSize.type.index,
              labels: imageMapLabels.type,
            }"
            @confirm="confirmType('type')"
            @select="(idx, id) => selectType('type', idx, id)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.thicknessLabel`) }}
          <template #actions>
            <expansion-panel-actions :valid="confirmed.thickness" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <image-map-selector
            v-if="imageMaps.thickness"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: imageMaps.thickness,
              id: portionSize.thickness.id,
              index: portionSize.thickness.index,
              labels: imageMapLabels.thickness,
            }"
            @confirm="confirmType('thickness')"
            @select="(idx, id) => selectType('thickness', idx, id)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!confirmed.type">
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.sizeLabel`) }}
          <template #actions>
            <expansion-panel-actions :valid="confirmed.slice" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <image-map-selector
            v-if="imageMaps.slice"
            v-bind="{
              config: prompt.imageMap,
              disabled: portionSize.slice.index === undefined,
              imageMapData: imageMaps.slice,
              id: portionSize.slice.id,
              index: portionSize.slice.index ? portionSize.slice.index - 1 : undefined,
              labels: imageMapLabels.slice,
            }"
            @confirm="confirmType('slice')"
            @select="(idx, id) => selectType('slice', idx + 1, id)"
          >
            <template #label>
              <v-btn
                class="ma-2 font-weight-medium"
                :color="isWholeSelected ? 'info' : ''"
                rounded
                :title="$t(`prompts.${type}.whole.confirm`)"
                @click="selectType('slice', 0, '0')"
              >
                {{ $t(`prompts.${type}.whole.confirm`) }}
              </v-btn>
            </template>
          </image-map-selector>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!confirmed.slice">
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.${isWholeSelected ? 'whole' : 'slices'}.label`) }}
          <template #actions>
            <expansion-panel-actions :valid="confirmed.quantity" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <quantity-card
            v-model="portionSize.slice.quantity"
            v-model:confirmed="confirmed.quantity"
            @update:confirmed="confirmType('quantity', $event)"
            @update:model-value="selectQuantity"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import type { ImageMapResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import { ImageMapSelector, QuantityCard } from '../partials';
import createBasePortion from './createBasePortion';

type PizzaImageMap = 'type' | 'thickness' | 'slice';

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

  mixins: [createBasePortion<'pizza-prompt'>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['pizza']>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

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

      ...copy(this.modelValue),
    };
  },

  computed: {
    labelsEnabled() {
      return this.prompt.imageMap.labels && !!this.parameters.imageMapLabels;
    },

    imageMapIds(): Record<PizzaImageMap, string> {
      return {
        type: this.typeImageMapId,
        thickness: this.thicknessImageMapId,
        slice: this.sliceImageMapId,
      };
    },

    imageMapLabels(): Record<PizzaImageMap, string[]> {
      return Object.keys(this.imageMapIds).reduce<Record<PizzaImageMap, string[]>>(
        (acc, key) => {
          const pizzaType = key as PizzaImageMap;

          acc[pizzaType]
            = this.imageMaps[pizzaType]?.objects.map(({ label }) => this.translate(label)) ?? [];
          return acc;
        },
        {} as Record<PizzaImageMap, string[]>,
      );
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

      if (id === undefined)
        return '';

      return `${sliceImageMapPrefix}${id}`;
    },

    typeValid() {
      return (
        this.portionSize.type.id !== undefined
        && this.portionSize.type.index !== undefined
        && this.confirmed.type
      );
    },

    thicknessValid() {
      return (
        this.portionSize.thickness.id !== undefined
        && this.portionSize.thickness.index !== undefined
        && this.confirmed.thickness
      );
    },

    sliceValid() {
      return (
        this.portionSize.slice.id !== undefined
        && this.portionSize.slice.index !== undefined
        && this.confirmed.slice
      );
    },

    quantityValid() {
      return this.confirmed.quantity;
    },

    validConditions(): boolean[] {
      return [this.psmValid, this.typeValid, this.thicknessValid, this.sliceValid, this.quantityValid];
    },
  },

  watch: {
    async sliceImageMapId(val) {
      if (!val)
        return;

      await this.fetchPizzaImageMap('slice');
    },
  },

  async mounted() {
    await Promise.all(
      Object.keys(this.imageMapIds).map(key => this.fetchPizzaImageMap(key as PizzaImageMap)),
    );
  },

  methods: {
    async fetchPizzaImageMap(type: PizzaImageMap) {
      const imageMapId = this.imageMapIds[type];
      if (!imageMapId)
        return;

      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${imageMapId}`,
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

        if (!this.$vuetify.display.mobile)
          this.confirmType(type);
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

    sliceWeight(type?: number, slice?: number, thickness?: number) {
      if (type === undefined || slice === undefined || thickness === undefined)
        return 0;

      return sliceWeights[type][slice] * thicknessFactors[type][thickness];
    },

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight
        = this.sliceWeight(
          Number(portionSize.type.id) - 1,
          Number(portionSize.slice.id),
          Number(portionSize.thickness.id) - 1,
        ) * portionSize.slice.quantity;

      const state: PromptStates['pizza-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        confirmed: this.confirmed,
      };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
