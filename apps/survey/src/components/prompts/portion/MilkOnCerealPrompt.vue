<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.container`">
            <template #food>
              <span class="font-weight-medium">{{ localeFoodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="bowlValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="bowlImageMap"
            :image-map-data="bowlImageMap"
            :value="portionSize.bowlIndex"
            @confirm="confirmBowl"
            @input="selectBowl"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.milk`"></i18n>
          <template #actions>
            <valid-invalid-icon :valid="milkLevelValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="milkLevelImageMap"
            :image-map-data="milkLevelImageMap"
            :value="portionSize.milkLevelChoice"
            @confirm="confirmMilk"
            @input="selectMilk"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!isValid" @click="confirm"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MilkOnCerealPromptProps } from '@intake24/common/prompts';
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

type Bowl = typeof bowls[number];

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

  mixins: [createBasePortion<MilkOnCerealPromptProps, MilkOnCerealPromptState>()],

  props: {
    promptProps: {
      type: Object as PropType<MilkOnCerealPromptProps>,
      required: true,
    },
    bowlImageMapId: {
      type: String,
      default: 'gbowl',
    },
  },

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
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

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
        this.portionSize.bowlIndex !== undefined &&
        this.portionSize.bowl &&
        this.bowlConfirmed
      );
    },

    milkLevelValid() {
      return this.portionSize.milkLevelChoice !== undefined && this.milkLevelConfirmed;
    },

    isValid(): boolean {
      return this.bowlValid && this.milkLevelValid;
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
      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.milkLevelImageMapId}`
      );

      this.milkLevelImageMap = { ...data };
      this.portionSize.milkLevelImage = data.baseImageUrl;
    },

    updatePanel() {
      if (this.isValid) {
        this.closePanels();
        return;
      }

      if (!this.bowlValid) {
        this.setPanel(0);
        return;
      }

      this.setPanel(this.milkLevelValid ? -1 : 1);
    },

    selectBowl(idx: number) {
      this.portionSize.bowlIndex = idx;
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
      this.portionSize.milkLevelChoice = undefined;
      this.milkLevelConfirmed = false;
    },

    calculateMilkWeight(bowl: Bowl, idx: number) {
      return volumeDefs[bowl][idx] * this.milkDensity;
    },

    selectMilk(idx: number) {
      this.portionSize.milkLevelChoice = idx;
      this.milkLevelConfirmed = false;
      this.update();
    },

    confirmMilk() {
      this.milkLevelConfirmed = true;
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

    update() {
      const {
        portionSize: { bowl, milkLevelChoice },
      } = this;

      if (bowl && milkLevelChoice !== undefined)
        this.portionSize.servingWeight = this.calculateMilkWeight(bowl as Bowl, milkLevelChoice);

      const state: MilkOnCerealPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        milkLevelConfirmed: this.milkLevelConfirmed,
      };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
