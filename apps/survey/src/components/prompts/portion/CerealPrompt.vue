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
            }"
            @confirm="confirmBowl"
            @select="selectBowl"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!bowlValid">
        <v-expansion-panel-header>
          <i18n path="prompts.asServed.serving.header">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="servingImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.serving?.weight"
                :valid="servingImageConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <as-served-selector
            v-if="servingImageSet"
            v-model="portionSize.serving"
            :as-served-set-id="servingImageSet"
            @confirm="confirmServing"
            @input="updateServing"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="leftoversEnabled" :disabled="!servingImageConfirmed">
        <v-expansion-panel-header>
          <i18n path="prompts.asServed.leftovers.header">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="leftoversPrompt === false || leftoversImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.leftovers?.weight"
                :valid="leftoversImageConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory />
          <template v-if="leftoversPrompt">
            <i18n class="mb-4" path="prompts.asServed.leftovers.label" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <as-served-selector
              v-model="portionSize.leftovers"
              :as-served-set-id="leftoverImageSet"
              :max-weight="portionSize.serving?.weight"
              type="leftovers"
              @confirm="confirmLeftovers"
              @input="updateLeftovers"
            />
          </template>
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
import type { PortionSizeParameters } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import { AsServedSelector, ImageMapSelector, QuantityBadge } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'CerealPrompt',

  components: { AsServedSelector, ImageMapSelector, QuantityBadge, YesNoToggle },

  mixins: [createBasePortion<'cereal-prompt'>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['cereal']>,
      required: true,
    },
    bowlImageMapId: {
      type: String,
      default: 'gbowl',
    },
  },

  emits: ['input'],

  data() {
    const bowls = ['A', 'B', 'C', 'D', 'E', 'F'];

    return {
      bowls,

      bowlImageMap: null as ImageMapResponse | null,

      ...copy(this.value),
    };
  },

  computed: {
    leftoversEnabled() {
      return this.prompt.leftovers && !!this.leftoverImageSet;
    },

    servingImageSet(): string | undefined {
      const {
        bowls,
        portionSize: { bowlIndex, method },
        parameters: { type },
      } = this;
      if (bowlIndex === undefined)
        return undefined;

      return `${method}_${type}${bowls[bowlIndex]}`;
    },

    leftoverImageSet(): string | undefined {
      const {
        bowls,
        portionSize: { bowlIndex, method },
        parameters: { type },
      } = this;
      if (bowlIndex === undefined)
        return undefined;

      return `${method}_${type}${bowls[bowlIndex]}_leftovers`;
    },

    bowlValid() {
      return !!(
        this.portionSize.bowlId !== undefined
        && this.portionSize.bowlIndex !== undefined
        && this.portionSize.bowl
        && this.bowlConfirmed
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

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      return conditions;
    },
  },

  watch: {
    leftoversPrompt() {
      this.portionSize.leftovers = null;

      this.updatePanel();
      this.update();
    },
  },

  async mounted() {
    await this.fetchBowlImageMap();
  },

  methods: {
    async fetchBowlImageMap() {
      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.bowlImageMapId}`,
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

    updateServing() {
      this.servingImageConfirmed = false;

      if (this.isValid)
        this.clearErrors();

      this.update();
    },

    confirmServing() {
      this.servingImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateLeftovers() {
      this.leftoversImageConfirmed = false;

      if (this.isValid)
        this.clearErrors();

      this.update();
    },

    confirmLeftovers() {
      this.leftoversImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    update() {
      this.portionSize.servingWeight = this.portionSize.serving?.weight ?? 0;
      this.portionSize.leftoversWeight = this.portionSize.leftovers?.weight ?? 0;

      const state: PromptStates['cereal-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
      };

      this.$emit('input', state);
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
