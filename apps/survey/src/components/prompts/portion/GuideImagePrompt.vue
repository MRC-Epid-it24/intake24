<template>
  <base-layout v-bind="{ food, prompt, isValid }" @action="action">
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
              <span class="font-weight-medium">{{ foodName }}</span>
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
        v-if="linkedQuantityCategories.length"
        v-bind="{ food, linkedQuantityCategories, parentFood, prompt }"
        v-model="portionSize.linkedQuantity"
        :confirm.sync="linkedQuantityConfirmed"
        :disabled="!quantityValid"
        @input="selectLinkedQuantity"
        @update:confirm="confirmLinkedQuantity"
      ></linked-quantity>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/types';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

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
    linkedQuantityCategories: {
      type: Array as PropType<Prompts['guide-image-prompt']['linkedQuantityCategories']>,
      required: true,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['guide-image']>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { food } = toRefs(props);

    const { getLocaleContent } = useLocale();
    const { foodName } = useFoodUtils(food);

    return {
      foodName,
      getLocaleContent,
    };
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
    labelsEnabled() {
      return this.prompt.imageMap.labels && this.parameters['image-map-labels'];
    },

    labels() {
      if (!this.labelsEnabled || !this.guideImageData) return [];

      const { guideImageData } = this;

      return guideImageData.imageMap.objects.map((object) => {
        const { label, weight } = guideImageData.objects[object.id];

        return (
          this.getLocaleContent(label, { params: { weight } }) ||
          this.getLocaleContent(object.label, { params: { weight } })
        );
      });
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

      if (this.linkedQuantityCategories.length) conditions.push(this.linkedQuantityConfirmed);

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

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
