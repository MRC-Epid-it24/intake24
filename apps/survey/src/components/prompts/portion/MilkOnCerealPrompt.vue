<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
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
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!isValid" @click="submit"></continue>
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

export interface MilkOnCerealPromptState {
  portionSize: MilkOnCerealState;
  panel: number;
  bowlConfirmed: boolean;
  milkLevelConfirmed: boolean;
}

export default defineComponent({
  name: 'MilkOnCerealPrompt',

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
    const bowls = ['A', 'B', 'C', 'D', 'E', 'F'];
    const milkLevelImageMapPrefix = 'milkbowl';

    return {
      bowls,
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

    milkLevelImageMapId(): string | undefined {
      const {
        bowls,
        milkLevelImageMapPrefix,
        portionSize: { bowlIndex },
      } = this;
      if (bowlIndex === undefined) return undefined;

      return `${milkLevelImageMapPrefix}${bowls[bowlIndex]}`;
    },

    bowlValid() {
      return (
        this.portionSize.bowlIndex !== undefined && this.portionSize.bowl && this.bowlConfirmed
      );
    },

    milkLevelValid() {
      return this.portionSize.milkLevelChoice !== undefined && this.milkLevelConfirmed;
    },

    isValid(): boolean {
      // bowl not yet selected
      if (!this.bowlValid) return false;

      // milk level selected
      if (!this.milkLevelValid) return false;

      return true;
    },
  },

  watch: {
    async milkLevelImageMapId(val) {
      if (!val) return;

      await this.fetchMilkLevelImageMap();
    },
  },

  async mounted() {
    await this.fetchBowlImageMap();
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
      this.update();
    },

    confirmBowl() {
      this.bowlConfirmed = true;
      this.updatePanel();
      this.update();
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

    submit() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('continue');
    },

    update() {
      /* this.portionSize.servingWeight = this.portionSize.serving?.weight ?? 0;
      this.portionSize.leftoversWeight = this.portionSize.leftovers?.weight ?? 0; */

      const state: MilkOnCerealPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        milkLevelConfirmed: this.milkLevelConfirmed,
      };

      this.$emit('update', state);
    },

    /* setDisplayQuestions(value: boolean) {
      this.displayQuestions = value;
    },

    emitFoodSelected(value: string) {
      this.foodValue = value;
      this.foodSelected = true;
      this.setPanel(1);
    },

    selectPortionMethod(value: string) {
      this.portionMethodSelected = true;
      this.portionMethodValue = value;
      this.setPanel(2);
      if (!this.imageMapLoaded) {
        this.fetchImageMapData();
      }
    },

    selectPortion() {
      this.portionSelected = true;
      this.setPanel(-1);
    },

    submit() {
      if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
        console.log('submitted');
      } else {
        console.log('not complete');
      }
    }, */
  },
});
</script>

<style lang="scss" scoped></style>
