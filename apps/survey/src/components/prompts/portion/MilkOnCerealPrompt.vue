<template>
  <base-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :flat="isMobile" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.container`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="bowlValid"></expansion-panel-actions>
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
            }"
            @confirm="confirmBowl"
            @select="selectBowl"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!bowlValid">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.milk`"></i18n>
          <template #actions>
            <expansion-panel-actions :valid="milkLevelValid"></expansion-panel-actions>
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
            }"
            @confirm="confirmMilk"
            @select="selectMilk"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { MilkOnCerealState } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { ImageMapSelector } from './selectors';

export interface MilkOnCerealPromptState {
  portionSize: MilkOnCerealState;
  panel: number;
  bowlConfirmed: boolean;
  milkLevelConfirmed: boolean;
}

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

  components: { ImageMapSelector },

  mixins: [createBasePortion<'milk-on-cereal-prompt', MilkOnCerealPromptState>()],

  props: {
    bowlImageMapId: {
      type: String,
      default: 'gbowl',
    },
  },

  emits: ['update'],

  data() {
    const milkLevelImageMapPrefix = 'milkbowl';

    return {
      bowls,
      milkDensity,
      volumeDefs,
      milkLevelImageMapPrefix,

      bowlImageMap: null as ImageMapResponse | null,
      milkLevelImageMap: null as ImageMapResponse | null,

      ...copy(this.initialState),
    };
  },

  computed: {
    bowl() {
      return this.portionSize.bowl ?? undefined;
    },

    milkLevelImageMapId(): string | undefined {
      const { bowl, milkLevelImageMapPrefix } = this;
      if (bowl === undefined) return undefined;

      return `${milkLevelImageMapPrefix}${bowl}`;
    },

    bowlValid() {
      return !!(
        this.portionSize.bowlId !== undefined &&
        this.portionSize.bowlIndex !== undefined &&
        this.portionSize.bowl &&
        this.bowlConfirmed
      );
    },

    milkLevelValid() {
      return (
        this.portionSize.milkLevelId !== undefined &&
        this.portionSize.milkLevelIndex !== undefined &&
        this.milkLevelConfirmed
      );
    },

    validConditions(): boolean[] {
      return [this.bowlValid, this.milkLevelValid];
    },
  },

  watch: {
    async milkLevelImageMapId(val) {
      if (!val) return;

      await this.fetchMilkLevelImageMap();
    },
  },

  async mounted() {
    await Promise.all([this.fetchBowlImageMap(), this.fetchMilkLevelImageMap()]);
    if (this.parentFood?.portionSize?.method !== 'cereal') return;

    const { bowlIndex, bowlId } = this.parentFood.portionSize;

    if (bowlIndex !== undefined && bowlId !== undefined) {
      this.selectBowl(bowlIndex, bowlId);
      this.confirmBowl();
    }
  },

  methods: {
    async fetchBowlImageMap() {
      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.bowlImageMapId}`
      );

      this.bowlImageMap = { ...data };
      this.portionSize.imageUrl = data.baseImageUrl;
    },

    async fetchMilkLevelImageMap() {
      if (!this.milkLevelImageMapId) return;

      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.milkLevelImageMapId}`
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

    calculateMilkWeight(bowl: Bowl, idx: number) {
      return volumeDefs[bowl][idx] * this.milkDensity;
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
      const {
        portionSize: { bowl, milkLevelIndex },
      } = this;

      if (bowl && milkLevelIndex !== undefined)
        this.portionSize.servingWeight = this.calculateMilkWeight(bowl as Bowl, milkLevelIndex);

      const state: MilkOnCerealPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        milkLevelConfirmed: this.milkLevelConfirmed,
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
