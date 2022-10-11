<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <!-- Step 1: Select image map -->
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
                @input="selectObject"
              ></image-map-selector>
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    :disabled="portionSize.bowlIndex === undefined"
                    @click="confirmObject"
                  >
                    {{ $t('common.action.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="servingImageSet">
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.as-served.serving.header`) }}
              <template #actions>
                <as-served-weight
                  :valid="servingImageConfirmed"
                  :weight="portionSize.serving?.weight"
                ></as-served-weight>
                <valid-invalid-icon
                  class="ml-1"
                  :valid="servingImageConfirmed"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  {{ $t(`portion.as-served.serving.label`, { food: localeFoodName }) }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <as-served-selector
                    :as-served-set-id="servingImageSet"
                    :initial-state="portionSize.serving?.index"
                    @confirm="confirmServing"
                    @update="updateServing"
                  ></as-served-selector>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="!disabledLeftovers && leftoverImageSet">
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.as-served.leftover.header`, { food: localeFoodName }) }}
              <template #actions>
                <as-served-weight
                  :valid="leftoversImageConfirmed"
                  :weight="portionSize.leftovers?.weight"
                ></as-served-weight>
                <valid-invalid-icon
                  class="ml-1"
                  :valid="leftoversPrompt === false || leftoversImageConfirmed"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <p>{{ $t(`portion.as-served.leftover.question`, { food: localeFoodName }) }}</p>
                  <v-btn-toggle v-model="leftoversPrompt" color="success" @change="update">
                    <v-btn class="px-4" :value="true">
                      {{ $t('common.action.confirm.yes') }}
                    </v-btn>
                    <v-btn class="px-4" :value="false">
                      {{ $t('common.action.confirm.no') }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <template v-if="leftoversPrompt">
                <v-row>
                  <v-col>
                    {{ $t(`portion.as-served.leftover.label`, { food: localeFoodName }) }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <as-served-selector
                      :as-served-set-id="leftoverImageSet"
                      :initial-state="portionSize.leftovers?.index"
                      :type="'leftover'"
                      @confirm="confirmLeftovers"
                      @update="updateLeftovers"
                    ></as-served-selector>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-show="errors.length">
      <v-col>
        <v-alert v-if="hasErrors" color="error">
          <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
        </v-alert>
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

import type { CerealPromptProps } from '@intake24/common/prompts';
import type { CerealParameters, CerealState, SelectedAsServedImage } from '@intake24/common/types';
import type { ImageMapResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { AsServedSelector, AsServedWeight, ImageMapSelector } from './selectors';

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

  components: { AsServedSelector, AsServedWeight, ImageMapSelector },

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
    return {
      bowlImageMap: null as ImageMapResponse | null,
      bowls: ['A', 'B', 'C', 'D', 'E', 'F'],

      ...copy(this.initialState),
    };
  },

  computed: {
    disabledLeftovers() {
      return !this.leftovers;
    },

    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
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
      return (
        this.portionSize.bowlIndex !== undefined && this.portionSize.bowl && this.bowlConfirmed
      );
    },

    servingValid(): boolean {
      return !!(this.portionSize.serving && this.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.portionSize.leftovers && this.leftoversImageConfirmed);
    },

    isValid(): boolean {
      // bowl not yet selected
      if (!this.bowlValid) return false;

      // serving not yet selected
      if (!this.servingValid) return false;

      // Leftover disables || leftovers have been confirmed
      if (this.disabledLeftovers || this.leftoversPrompt === false) return true;

      // leftovers not yet selected
      if (!this.leftoversValid) return false;

      return true;
    },
  },

  async mounted() {
    await this.fetchBowImageMap();
  },

  methods: {
    async fetchBowImageMap() {
      const { data } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.bowlImageMapId}`
      );

      this.bowlImageMap = { ...data };
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

      if (!this.servingValid) {
        this.setPanel(1);
        return;
      }

      this.setPanel(this.leftoversPrompt === false || this.leftoversValid ? -1 : 2);
    },

    selectObject(idx: number) {
      this.portionSize.bowlIndex = idx;
      this.portionSize.bowl = this.bowls[idx];
      this.bowlConfirmed = false;
      this.update();
    },

    confirmObject() {
      this.bowlConfirmed = true;
      this.updatePanel();
      this.update();
    },

    updateServing(update: SelectedAsServedImage | null) {
      this.portionSize.serving = update;

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

    submit() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('continue');
    },

    update() {
      const state: CerealPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        bowlConfirmed: this.bowlConfirmed,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
      };

      this.$emit('update', state);
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
