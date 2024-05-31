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
            <expansion-panel-actions :valid="bowlValid" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="bowlImageMap"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: bowlImageMap,
              id: portionSize.bowlId,
              index: portionSize.bowlIndex,
              labels: bowlLabels,
            }"
            @confirm="confirmBowl"
            @select="selectBowl"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!bowlValid">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.milk`" />
          <template #actions>
            <expansion-panel-actions :valid="milkLevelValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="milkLevelWeight"
                :valid="milkLevelValid"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="milkLevelImageMap"
            v-bind="{
              config: prompt.imageMap,
              imageMapData: milkLevelImageMap,
              id: portionSize.milkLevelId,
              index: portionSize.milkLevelIndex,
              labels: milkLevelLabels,
            }"
            @confirm="confirmMilk"
            @select="selectMilk"
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
import type { EncodedFood, PortionSizeParameters } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import { ImageMapSelector, QuantityBadge } from '../partials';
import createBasePortion from './createBasePortion';

const bowls = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

type Bowl = (typeof bowls)[number];

const milkDensity = 1.032;

const volumeDefs: Record<Bowl, number[]> = {
  A: [52.3, 100.0, 172.0, 267.7, 389.3, 522.3],
  B: [62.7, 138.0, 249.0, 385.7],
  C: [49.0, 121.3, 233.3, 358.7, 481.0, 622.3],
  D: [18.3, 36.0, 70.3, 126.7, 195.3, 287.3],
  E: [38.0, 103.7, 197.0, 305.7, 428.0, 559.3],
  F: [49.3, 104.7, 187.7, 295.3, 420.0, 570.3],
};

export default defineComponent({
  name: 'MilkOnCerealPrompt',

  components: { ImageMapSelector, QuantityBadge },

  mixins: [createBasePortion<'milk-on-cereal-prompt', EncodedFood>()],

  props: {
    bowlImageMapId: {
      type: String,
      default: 'gbowl',
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['milk-on-cereal']>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    const milkLevelImageMapPrefix = 'milkbowl';

    return {
      bowls,
      milkDensity,
      volumeDefs,
      milkLevelImageMapPrefix,

      bowlImageMap: null as ImageMapResponse | null,
      milkLevelImageMap: null as ImageMapResponse | null,

      ...copy(this.value),
    };
  },

  computed: {
    labelsEnabled() {
      return this.prompt.imageMap.labels && !!this.parameters.imageMapLabels;
    },

    bowlLabels() {
      if (!this.labelsEnabled || !this.bowlImageMap)
        return [];

      return this.bowlImageMap.objects.map(({ label }) => this.translate(label));
    },

    bowl() {
      return this.portionSize.bowl ?? undefined;
    },

    milkLevelImageMapId(): string | undefined {
      const { bowl, milkLevelImageMapPrefix } = this;
      if (bowl === undefined)
        return undefined;

      return `${milkLevelImageMapPrefix}${bowl}`;
    },

    milkLevelLabels() {
      if (!this.labelsEnabled || !this.milkLevelImageMap)
        return [];

      return this.milkLevelImageMap.objects.map(({ label }) => this.translate(label));
    },

    bowlValid() {
      return !!(
        this.portionSize.bowlId !== undefined
        && this.portionSize.bowlIndex !== undefined
        && this.portionSize.bowl
        && this.bowlConfirmed
      );
    },

    milkLevelWeight() {
      if (!this.portionSize.bowl || this.portionSize.milkLevelIndex === undefined)
        return undefined;

      return (
        volumeDefs[this.portionSize.bowl as Bowl][this.portionSize.milkLevelIndex]
        * this.milkDensity
      );
    },

    milkLevelValid() {
      return (
        this.portionSize.milkLevelId !== undefined
        && this.portionSize.milkLevelIndex !== undefined
        && this.milkLevelConfirmed
      );
    },

    validConditions(): boolean[] {
      return [this.bowlValid, this.milkLevelValid];
    },
  },

  watch: {
    async milkLevelImageMapId(val) {
      if (!val)
        return;

      await this.fetchMilkLevelImageMap();
    },
  },

  async mounted() {
    await Promise.all([this.fetchBowlImageMap(), this.fetchMilkLevelImageMap()]);
    if (
      this.parentFood?.type !== 'encoded-food'
      || this.parentFood?.portionSize?.method !== 'cereal'
    ) {
      return;
    }

    const { bowlIndex, bowlId } = this.parentFood.portionSize;

    if (bowlIndex !== undefined && bowlId !== undefined) {
      this.selectBowl(bowlIndex, bowlId);
      this.confirmBowl();
    }
  },

  methods: {
    async fetchBowlImageMap() {
      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.bowlImageMapId}`,
      );

      this.bowlImageMap = { ...data };
      this.portionSize.imageUrl = data.baseImageUrl;
    },

    async fetchMilkLevelImageMap() {
      if (!this.milkLevelImageMapId)
        return;

      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.milkLevelImageMapId}`,
      );

      this.milkLevelImageMap = { ...data };
      this.portionSize.milkLevelImage = data.baseImageUrl;
    },

    selectBowl(idx: number, id: string) {
      this.portionSize.bowlIndex = idx;
      this.portionSize.bowlId = id;
      this.portionSize.bowl = this.bowls[idx];
      this.bowlConfirmed = false;
      this.clearMilk();

      this.update();
    },

    confirmBowl() {
      this.bowlConfirmed = true;
      this.updatePanel();
      this.update();
    },

    clearMilk() {
      this.portionSize.milkLevelId = undefined;
      this.portionSize.milkLevelIndex = undefined;
      this.milkLevelConfirmed = false;
    },

    selectMilk(idx: number, id: string) {
      this.portionSize.milkLevelIndex = idx;
      this.portionSize.milkLevelId = id;
      this.milkLevelConfirmed = false;
      this.update();
    },

    confirmMilk() {
      this.milkLevelConfirmed = true;
      this.updatePanel();
      this.update();
    },

    update() {
      const { milkLevelWeight } = this;

      if (milkLevelWeight !== undefined)
        this.portionSize.servingWeight = milkLevelWeight;

      const state: PromptStates['milk-on-cereal-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        milkLevelConfirmed: this.milkLevelConfirmed,
      };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
