<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.label`">
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
          >
          </image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!objectValid">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.quantity`">
            <template #food>
              <span class="font-weight-medium">{{ selectedFoodLabel }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.quantity"
                unit=""
                :valid="quantityConfirmed"
              ></quantity-badge>
            </expansion-panel-actions>
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
      <linked-quantity
        v-if="linkedParent"
        v-bind="{ disabled: !quantityValid, food, linkedParent, prompt }"
        v-model="portionSize.linkedQuantity"
        :confirm.sync="linkedQuantityConfirmed"
        @input="selectLinkedQuantity"
        @update:confirm="confirmLinkedQuantity"
      ></linked-quantity>
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
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';

import type { LinkedParent } from '../partials';
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

  emits: ['input'],

  setup(props) {
    const { translate } = useI18n();
    const { foodName } = useFoodUtils(props);

    return {
      foodName,
      translate,
    };
  },

  data() {
    const state = copy(this.value);
    state.portionSize.guideImageId = this.parameters['guide-image-id'];

    return {
      guideImageData: null as GuideImageResponse | null,
      ...state,
    };
  },

  computed: {
    labelsEnabled() {
      return this.prompt.imageMap.labels && this.parameters['image-map-labels'];
    },

    labels() {
      if (!this.labelsEnabled || !this.guideImageData) return [];

      const { guideImageData } = this;

      return guideImageData.imageMap.objects.map((object) => {
        const { label, weight } = guideImageData.objects[object.id];

        return (
          this.translate(label, { params: { food: this.foodName, weight } }) ||
          this.translate(object.label, { params: { food: this.foodName, weight } })
        );
      });
    },

    selectedFoodLabel() {
      if (!this.labels.length || this.portionSize.objectIndex === undefined) return this.foodName;

      return this.labels[this.portionSize.objectIndex] || this.foodName;
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
      const conditions = [this.objectValid, this.quantityValid];

      if (this.linkedParent?.categories.length) conditions.push(this.linkedQuantityConfirmed);

      return conditions;
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
        this.portionSize.servingWeight =
          this.guideImageData.objects[id].weight *
          this.portionSize.quantity *
          this.conversionFactor *
          this.portionSize.linkedQuantity;
      }

      const state: PromptStates['guide-image-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
