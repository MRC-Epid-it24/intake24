<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.container`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="objectValid" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMapData"
            v-bind="{
              config: prompt.imageMap,
              imageMapData,
              id: portionSize.containerId,
              index: portionSize.containerIndex,
              labels,
            }"
            @confirm="confirmObject"
            @select="selectObject"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!objectValid">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.serving.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="quantityConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="
                  portionSize.servingWeight
                    ? portionSize.servingWeight / portionSize.count
                    : undefined
                "
                unit="ml"
                :valid="quantityConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="scale.version === 1 ? 'drink-scale-panel' : 'drink-scale-v2-panel'"
            v-if="scale"
            v-model="portionSize.fillLevel"
            :open="panel === 1"
            :scale="scale"
            @confirm="confirmQuantity"
            @input="updateQuantity"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="leftoversEnabled" :disabled="!quantityConfirmed">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.leftovers.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="leftoversPrompt === false || leftoversConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="
                  portionSize.leftoversWeight
                    ? portionSize.leftoversWeight / portionSize.count
                    : undefined
                "
                unit="ml"
                :valid="leftoversConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory />
          <template v-if="leftoversPrompt">
            <i18n class="mb-4" :path="`prompts.${type}.leftovers.label`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <component
              :is="scale.version === 1 ? 'drink-scale-panel' : 'drink-scale-v2-panel'"
              v-if="scale"
              v-model="portionSize.leftoversLevel"
              :max-fill-level="portionSize.fillLevel"
              :open="panel === 2"
              :scale="scale"
              type="leftovers"
              @confirm="confirmLeftovers"
              @input="updateLeftovers"
            />
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="multipleEnabled" :disabled="!quantityConfirmed">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.count`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="countConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.count ?? undefined"
                unit=""
                :valid="leftoversConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="prompt.multiple.type"
            v-if="prompt.multiple"
            v-model="portionSize.count"
            :confirmed.sync="countConfirmed"
            v-bind="multipleProps"
            @input="updateCount"
            @update:confirmed="confirmCount"
          />
        </v-expansion-panel-content>
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
import type { DrinkwareScaleEntry } from '@intake24/common/types/http/admin';
import type { DrinkwareScaleV2Response, DrinkwareSetResponse, ImageMapResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import {
  calculateVolume as calculateVolumeLUT,
  DrinkScalePanel,
  DrinkScaleV2Panel,
  getScaleBounds,
  ImageMapSelector,
  QuantityBadge,
  QuantityCard,
  QuantitySlider,
} from '../partials';
import { calculateFillVolume, getSymmetryShape } from '../partials/drink-scale-cylindrical';
import createBasePortion from './createBasePortion';

function calculateVolume(scale: DrinkwareScaleEntry | DrinkwareScaleV2Response, fillLevel: number): number {
  if (scale.version === 1)
    return calculateVolumeLUT(scale.volumeSamples, fillLevel);

  if (scale.volumeMethod === 'lookUpTable')
    return calculateVolumeLUT(scale.volumeSamplesNormalised, fillLevel);

  // This is redundant, but the state handling code in this prompt is quite complicated
  // so it's easier to just do it again here instead of refactoring the data flow :(

  const symmetryShape = getSymmetryShape(scale.outlineCoordinates);
  const scaleBounds = getScaleBounds(scale.outlineCoordinates);
  const { minY, maxY } = scaleBounds;
  const scaleHeight = maxY - minY;
  const fillLineY = maxY - scaleHeight * fillLevel;
  const fullVolume = calculateFillVolume(symmetryShape, minY, 0.05);
  const filledVolume = calculateFillVolume(symmetryShape, fillLineY, 0.05);
  return (filledVolume * scale.volumeSamplesNormalised[scale.volumeSamplesNormalised.length - 1]) / fullVolume;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: {
    DrinkScalePanel,
    DrinkScaleV2Panel,
    ImageMapSelector,
    QuantityBadge,
    Slider: QuantitySlider,
    Counter: QuantityCard,
    YesNoToggle,
  },

  mixins: [createBasePortion<'drink-scale-prompt'>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['drink-scale']>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    const state = copy(this.value);
    state.portionSize.drinkwareId = this.parameters.drinkwareId;
    state.portionSize.initialFillLevel = this.parameters.initialFillLevel;
    state.portionSize.skipFillLevel = this.parameters.skipFillLevel;

    if (!state.portionSize.fillLevel)
      state.portionSize.fillLevel = state.portionSize.initialFillLevel;

    return {
      ...state,
      drinkwareSetData: null as DrinkwareSetResponse | null,
      imageMapData: null as ImageMapResponse | null,
    };
  },

  computed: {
    multipleProps() {
      if (!this.prompt.multiple)
        return undefined;

      const { type, ...rest } = this.prompt.multiple;

      return rest;
    },
    multipleEnabled(): boolean {
      return !!this.prompt.multiple && !!this.parameters.multiple;
    },

    leftoversEnabled() {
      return this.prompt.leftovers;
    },

    labelsEnabled() {
      return this.prompt.imageMap.labels && !!this.parameters.imageMapLabels;
    },

    labels() {
      if (!this.labelsEnabled || !this.imageMapData)
        return [];

      return this.imageMapData.objects.map((object) => {
        const scale = this.drinkwareSetData?.scales.find(
          ({ choiceId }) => choiceId.toString() === object.id,
        );

        if (!scale)
          return '';

        const volume = scale.version === 1
          ? scale.volumeSamples[scale.volumeSamples.length - 1]
          : scale.volumeSamplesNormalised[scale.volumeSamplesNormalised.length - 1];

        return (
          this.translate(scale.label, { params: { volume } })
          || this.translate(object.label, { params: { volume } })
        );
      });
    },

    scale() {
      const { containerId } = this.portionSize;
      if (containerId === undefined)
        return undefined;

      return this.drinkwareSetData?.scales.find(
        scale => scale.choiceId.toString() === containerId,
      );
    },

    skipFillLevel() {
      return this.parameters.skipFillLevel;
    },

    objectValid() {
      return (
        this.portionSize.containerId !== undefined
        && this.portionSize.containerIndex !== undefined
        && this.objectConfirmed
      );
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    leftoversValid() {
      return this.leftoversConfirmed;
    },

    countValid() {
      if (!this.prompt.multiple)
        return true;

      return !this.prompt.multiple.confirm || this.countConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.objectValid, this.quantityValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.multipleEnabled)
        conditions.push(this.countValid);

      return conditions;
    },

    nextStepConditions(): boolean[] {
      const conditions = [this.objectValid, this.quantityValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.multipleEnabled)
        conditions.push(this.countConfirmed);

      return conditions;
    },
  },

  watch: {
    leftoversPrompt(val: boolean) {
      this.portionSize.leftovers = val;
      this.portionSize.leftoversLevel = 0;

      this.updatePanel();
      this.update();
    },
  },

  async mounted() {
    await this.fetchDrinkScaleData();
  },

  methods: {
    async fetchDrinkScaleData() {
      const { data: drinkwareSetData } = await this.$http.get<DrinkwareSetResponse>(
        `portion-sizes/drinkware-sets/${this.parameters.drinkwareId}`,
      );

      this.drinkwareSetData = { ...drinkwareSetData };

      const { data: imageMapData } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.drinkwareSetData.imageMapId}`,
      );

      this.imageMapData = { ...imageMapData };
    },

    selectObject(idx: number, id: string) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData)
        return;

      this.objectConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.containerId = id;
      this.portionSize.imageUrl = drinkwareSetData.scales[idx].baseImageUrl;

      this.clearQuantity();
      this.clearLeftovers();

      this.portionSize.servingWeight = calculateVolume(drinkwareSetData.scales[idx], this.portionSize.fillLevel);

      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;

      if (this.skipFillLevel)
        this.quantityConfirmed = true;

      this.updatePanel();
      this.update();
    },

    clearQuantity() {
      this.portionSize.fillLevel = this.portionSize.initialFillLevel;
      this.quantityConfirmed = false;
    },

    updateQuantity() {
      this.quantityConfirmed = false;
      this.clearLeftovers();
      this.update();
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
      this.updatePanel();
      this.update();
    },

    clearLeftovers() {
      this.portionSize.leftovers = false;
      this.leftoversConfirmed = false;
      this.leftoversPrompt = undefined;
    },

    updateLeftovers() {
      this.leftoversConfirmed = false;
      this.update();
    },

    confirmLeftovers() {
      this.leftoversConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateCount() {
      this.countConfirmed = false;
      this.update();
    },

    confirmCount() {
      this.countConfirmed = true;
      this.updatePanel();
      this.update();
    },

    update() {
      if (this.scale) {
        this.portionSize.servingWeight
          = calculateVolume(this.scale, this.portionSize.fillLevel) * this.portionSize.count;
        this.portionSize.leftoversWeight
          = calculateVolume(this.scale, this.portionSize.leftoversLevel) * this.portionSize.count;
      }

      const state: PromptStates['drink-scale-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
        leftoversConfirmed: this.leftoversConfirmed,
        leftoversPrompt: this.leftoversPrompt,
        countConfirmed: this.countConfirmed,
      };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
