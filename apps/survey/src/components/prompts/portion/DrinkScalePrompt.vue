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
            <expansion-panel-actions :valid="objectValid"></expansion-panel-actions>
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
          ></image-map-selector>
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
              ></quantity-badge>
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <drink-scale-panel
            v-if="scale"
            v-model="portionSize.fillLevel"
            :open="panel === 1"
            :scale="scale"
            @confirm="confirmQuantity"
            @input="updateQuantity"
          >
          </drink-scale-panel>
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
              ></quantity-badge>
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory></yes-no-toggle>
          <template v-if="leftoversPrompt">
            <i18n class="mb-4" :path="`prompts.${type}.leftovers.label`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <drink-scale-panel
              v-if="scale"
              v-model="portionSize.leftoversLevel"
              :max-fill-level="portionSize.fillLevel"
              :open="panel === 2"
              :scale="scale"
              type="leftovers"
              @confirm="confirmLeftovers"
              @input="updateLeftovers"
            >
            </drink-scale-panel>
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
              ></quantity-badge>
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-slider
            v-model="portionSize.count"
            :slider="prompt.multiple"
            @confirm="confirmCount"
            @input="updateCount"
          ></quantity-slider>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/types';
import type {
  DrinkwareSetResponse,
  DrinkwareVolumeSampleResponse,
  ImageMapResponse,
} from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import {
  calculateVolume,
  DrinkScalePanel,
  ImageMapSelector,
  QuantityBadge,
  QuantitySlider,
} from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { DrinkScalePanel, ImageMapSelector, QuantityBadge, QuantitySlider, YesNoToggle },

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
    state.portionSize.drinkwareId = this.parameters['drinkware-id'];
    state.portionSize.initialFillLevel = this.parameters['initial-fill-level'];
    state.portionSize.skipFillLevel = this.parameters['skip-fill-level'];

    if (!state.portionSize.fillLevel)
      state.portionSize.fillLevel = state.portionSize.initialFillLevel;

    return {
      ...state,
      drinkwareSetData: null as DrinkwareSetResponse | null,
      imageMapData: null as ImageMapResponse | null,
    };
  },

  computed: {
    multipleEnabled(): boolean {
      return !!this.prompt.multiple && !!this.parameters['multiple'];
    },

    leftoversEnabled() {
      return this.prompt.leftovers;
    },

    labelsEnabled() {
      return this.prompt.imageMap.labels && this.parameters['image-map-labels'];
    },

    labels() {
      if (!this.labelsEnabled || !this.imageMapData) return [];

      return this.imageMapData.objects.map((object) => {
        const scale = this.drinkwareSetData?.scales.find(({ choiceId }) => choiceId === object.id);

        if (!scale) return '';

        const volume = scale.volumeSamples[scale.volumeSamples.length - 1].volume;

        return (
          this.translate(scale.label, { params: { volume } }) ||
          this.translate(object.label, { params: { volume } })
        );
      });
    },

    scale() {
      const { containerId } = this.portionSize;
      if (containerId === undefined) return undefined;

      return this.drinkwareSetData?.scales.find((scale) => scale.choiceId === containerId);
    },

    skipFillLevel() {
      return this.parameters['skip-fill-level'];
    },

    volumes(): DrinkwareVolumeSampleResponse[] | undefined {
      return this.scale?.volumeSamples;
    },

    objectValid() {
      return (
        this.portionSize.containerId !== undefined &&
        this.portionSize.containerIndex !== undefined &&
        this.objectConfirmed
      );
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    leftoversValid() {
      return this.leftoversConfirmed;
    },

    countValid() {
      return this.countConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.objectValid, this.quantityValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.multipleEnabled) conditions.push(this.countValid);

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
        `portion-sizes/drinkware-sets/${this.parameters['drinkware-id']}`
      );

      this.drinkwareSetData = { ...drinkwareSetData };

      const { data: imageMapData } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.drinkwareSetData.imageMapId}`
      );

      this.imageMapData = { ...imageMapData };
    },

    selectObject(idx: number, id: string) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData) return;

      this.objectConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.containerId = id;
      this.portionSize.imageUrl = drinkwareSetData.scales[idx].baseImageUrl;

      this.clearQuantity();
      this.clearLeftovers();

      if (this.volumes)
        this.portionSize.servingWeight = calculateVolume(this.volumes, this.portionSize.fillLevel);

      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;

      if (this.skipFillLevel) this.quantityConfirmed = true;

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
      const { volumes } = this;
      if (volumes) {
        this.portionSize.servingWeight =
          calculateVolume(volumes, this.portionSize.fillLevel) * this.portionSize.count;
        this.portionSize.leftoversWeight =
          calculateVolume(volumes, this.portionSize.leftoversLevel) * this.portionSize.count;
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
