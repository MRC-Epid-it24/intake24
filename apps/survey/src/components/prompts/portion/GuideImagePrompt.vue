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
          <i18n-t :keypath="`prompts.${type}.label`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="objectValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <image-map-selector
            v-if="guideImageData"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: guideImageData.imageMap,
              id: portionSize.objectId,
              index: portionSize.objectIndex,
              labels,
            }"
            @confirm="confirmObject"
            @select="selectObject"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!objectValid">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.quantity`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ selectedFoodLabel }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.quantity"
                unit=""
                :valid="quantityConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <quantity-card
            v-model="portionSize.quantity"
            v-model:confirmed="quantityConfirmed"
            @update:confirmed="confirmQuantity"
            @update:model-value="selectQuantity"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <linked-quantity
        v-if="linkedParent && !linkedParent.auto"
        v-bind="{ disabled: !quantityValid, food, linkedParent, prompt }"
        v-model="portionSize.linkedQuantity"
        v-model:confirmed="linkedQuantityConfirmed"
        @update:confirmed="confirmLinkedQuantity"
        @update:model-value="selectLinkedQuantity"
      />
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
import type { LinkedParent } from '../partials';

import { defineComponent } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';
import { ImageMapSelector, LinkedQuantity, QuantityBadge, QuantityCard } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'GuideImagePrompt',

  components: { ImageMapSelector, LinkedQuantity, QuantityBadge, QuantityCard },

  mixins: [createBasePortion<'guide-image-prompt'>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    linkedParent: {
      type: Object as PropType<LinkedParent>,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['guide-image']>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const { foodName } = useFoodUtils(props);

    return {
      foodName,
    };
  },

  data() {
    const state = copy(this.modelValue);
    state.portionSize.guideImageId = this.parameters.guideImageId;

    return {
      guideImageData: null as GuideImageResponse | null,
      ...state,
    };
  },

  computed: {
    labelsEnabled() {
      return this.prompt.imageMap.labels && !!this.parameters.imageMapLabels;
    },

    labels() {
      if (!this.labelsEnabled || !this.guideImageData)
        return [];

      const { guideImageData } = this;

      return guideImageData.imageMap.objects.map((object) => {
        const { label, weight } = guideImageData.objects[object.id];

        return (
          this.translate(label, { params: { food: this.foodName, weight } })
          || this.translate(object.label, { params: { food: this.foodName, weight } })
        );
      });
    },

    selectedFoodLabel() {
      if (!this.labels.length || this.portionSize.objectIndex === undefined)
        return this.foodName;

      return this.labels[this.portionSize.objectIndex] || this.foodName;
    },

    objectValid() {
      return (
        this.portionSize.objectId !== undefined
        && this.portionSize.objectIndex !== undefined
        && this.objectConfirmed
      );
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.psmValid, this.objectValid, this.quantityValid];

      if (this.linkedParent && !this.linkedParent.auto && this.linkedParent.categories.length)
        conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  async mounted() {
    await this.fetchGuideImageData();
  },

  methods: {
    async fetchGuideImageData() {
      const { data } = await this.$http.get<GuideImageResponse>(
        `portion-sizes/guide-images/${this.parameters.guideImageId}`,
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

    selectLinkedQuantity() {
      this.update();
    },

    confirmLinkedQuantity() {
      this.updatePanel();
      this.update();
    },

    update() {
      if (this.guideImageData && this.portionSize.objectId !== undefined) {
        const id = this.portionSize.objectId;

        this.portionSize.objectWeight = this.guideImageData.objects[id].weight ?? 0;
        this.portionSize.servingWeight
          = this.guideImageData.objects[id].weight
            * this.portionSize.quantity
            * this.conversionFactor
            * this.portionSize.linkedQuantity;
      }

      const state: PromptStates['guide-image-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
