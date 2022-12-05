<template>
  <portion-layout
    v-bind="{ actions, method: portionSize.method, description, text, food, isValid }"
    @action="action"
  >
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.container`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="bowlValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="bowlImageMap"
            v-bind="{
              config: imageMap,
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
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.as-served.serving.header`) }}
          <template #actions>
            <quantity-badge
              :amount="portionSize.serving?.weight"
              :valid="servingImageConfirmed"
            ></quantity-badge>
            <valid-invalid-icon class="ml-1" :valid="servingImageConfirmed"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>{{ $t(`portion.as-served.serving.label`, { food: foodName }) }}</p>
          <as-served-selector
            v-if="servingImageSet"
            :as-served-set-id="servingImageSet"
            :initial-object="portionSize.serving ?? undefined"
            @confirm="confirmServing"
            @update="updateServing"
          ></as-served-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="!disabledLeftovers && leftoverImageSet"
        :disabled="!servingImageConfirmed"
      >
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.as-served.leftovers.header`, { food: foodName }) }}
          <template #actions>
            <quantity-badge
              :amount="portionSize.leftovers?.weight"
              :valid="leftoversImageConfirmed"
            ></quantity-badge>
            <valid-invalid-icon
              class="ml-1"
              :valid="leftoversPrompt === false || leftoversImageConfirmed"
            ></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>{{ $t(`portion.as-served.leftovers.question`, { food: foodName }) }}</p>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" @change="update"></yes-no-toggle>
          <template v-if="leftoversPrompt">
            <p>{{ $t(`portion.as-served.leftovers.label`, { food: foodName }) }}</p>
            <as-served-selector
              :as-served-set-id="leftoverImageSet"
              :initial-object="portionSize.leftovers ?? undefined"
              :max-weight="portionSize.serving?.weight"
              type="leftovers"
              @confirm="confirmLeftovers"
              @update="updateLeftovers"
            ></as-served-selector>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row v-show="errors.length">
      <v-col>
        <v-alert v-if="hasErrors" color="error">
          <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
        </v-alert>
      </v-col>
    </v-row>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CerealPromptProps } from '@intake24/common/prompts';
import type { CerealParameters, CerealState, SelectedAsServedImage } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import createBasePortion from './createBasePortion';
import { AsServedSelector, ImageMapSelector, QuantityBadge } from './selectors';

export interface CerealPromptState {
  portionSize: CerealState;
  panel: number;
  bowlConfirmed: boolean;
  servingImageConfirmed: boolean;
  leftoversImageConfirmed: boolean;
  leftoversPrompt?: boolean;
}

export default defineComponent({
  name: 'CerealPrompt',

  components: { AsServedSelector, ImageMapSelector, QuantityBadge, YesNoToggle },

  mixins: [createBasePortion<CerealPromptProps, CerealPromptState>()],

  props: {
    parameters: {
      type: Object as PropType<CerealParameters>,
      required: true,
    },
    bowlImageMapId: {
      type: String,
      default: 'gbowl',
    },
  },

  data() {
    const bowls = ['A', 'B', 'C', 'D', 'E', 'F'];

    return {
      bowls,

      bowlImageMap: null as ImageMapResponse | null,

      ...copy(this.initialState),
    };
  },

  computed: {
    disabledLeftovers() {
      return !this.leftovers;
    },

    servingImageSet(): string | undefined {
      const {
        bowls,
        portionSize: { bowlIndex, method },
        parameters: { type },
      } = this;
      if (bowlIndex === undefined) return undefined;

      return `${method}_${type}${bowls[bowlIndex]}`;
    },

    leftoverImageSet(): string | undefined {
      const {
        bowls,
        portionSize: { bowlIndex, method },
        parameters: { type },
      } = this;
      if (bowlIndex === undefined) return undefined;

      return `${method}_${type}${bowls[bowlIndex]}_leftovers`;
    },

    bowlValid() {
      return !!(
        this.portionSize.bowlId !== undefined &&
        this.portionSize.bowlIndex !== undefined &&
        this.portionSize.bowl &&
        this.bowlConfirmed
      );
    },

    servingValid(): boolean {
      return !!(this.portionSize.serving && this.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.portionSize.leftovers && this.leftoversImageConfirmed);
    },

    validConditions(): boolean[] {
      const conditions = [this.bowlValid, this.servingValid];

      if (!this.disabledLeftovers)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      return conditions;
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

    selectBowl(idx: number, id: string) {
      this.portionSize.bowlIndex = idx;
      this.portionSize.bowlId = id;
      this.portionSize.bowl = this.bowls[idx];
      this.bowlConfirmed = false;
      this.update();
    },

    confirmBowl() {
      this.bowlConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateServing(update: SelectedAsServedImage | null) {
      this.portionSize.serving = update;
      this.servingImageConfirmed = false;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmServing() {
      this.servingImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateLeftovers(update: SelectedAsServedImage | null) {
      this.portionSize.leftovers = update;
      this.leftoversImageConfirmed = false;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmLeftovers() {
      this.leftoversImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    update() {
      this.portionSize.servingWeight = this.portionSize.serving?.weight ?? 0;
      this.portionSize.leftoversWeight = this.portionSize.leftovers?.weight ?? 0;

      const state: CerealPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
      };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped>
.guides-drawer {
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;

    .guides-drawer-polygon {
      cursor: pointer;
      fill: transparent;

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}
</style>
