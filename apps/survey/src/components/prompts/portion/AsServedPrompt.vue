<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.serving.header`) }}
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
                  {{ $t(`portion.${portionSize.method}.serving.label`, { food: localeFoodName }) }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <as-served-selector
                    :as-served-set-id="parameters['serving-image-set']"
                    :initial-state="portionSize.serving?.index"
                    @confirm="confirmServing"
                    @update="updateServing"
                  ></as-served-selector>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="parameters['leftovers-image-set']">
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.leftover.header`, { food: localeFoodName }) }}
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
                  <p>
                    {{
                      $t(`portion.${portionSize.method}.leftover.question`, {
                        food: localeFoodName,
                      })
                    }}
                  </p>
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
                    {{
                      $t(`portion.${portionSize.method}.leftover.label`, { food: localeFoodName })
                    }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <as-served-selector
                      :as-served-set-id="parameters['leftovers-image-set']"
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
        <v-alert v-for="(e, idx) in errors" :key="idx" outlined type="error">
          {{ e }}
        </v-alert>
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!continueEnabled" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { AsServedPromptProps } from '@intake24/common/prompts';
import type { AsServedState, SelectedAsServedImage } from '@intake24/common/types';
import type { AsServedParameters } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { AsServedSelector, AsServedWeight } from './selectors';

export interface AsServedPromptState {
  portionSize: AsServedState;
  panel: number;
  servingImageConfirmed: boolean;
  leftoversImageConfirmed: boolean;
  leftoversPrompt?: boolean;
}

export default defineComponent({
  name: 'AsServedPrompt',

  components: { AsServedSelector, AsServedWeight },

  mixins: [createBasePortion<AsServedPromptProps, AsServedPromptState>()],

  props: {
    parameters: {
      type: Object as PropType<AsServedParameters>,
      required: true,
    },
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    hasLeftovers() {
      return !!this.parameters['leftovers-image-set'];
    },

    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    isValid(): boolean {
      // serving not yet selected
      if (!this.portionSize.serving || !this.servingImageConfirmed) return false;

      // Food has no leftovers or leftovers have been confirmed
      if (!this.hasLeftovers || this.leftoversPrompt === false) return true;

      // leftovers not yet selected
      if (!this.portionSize.leftovers || !this.leftoversImageConfirmed) return false;

      return true;
    },
  },

  methods: {
    setPanel(panelIdComplete: number) {
      if (this.isValid) {
        this.panel = -1;
        return;
      }

      // Completed asServed
      if (panelIdComplete === 0) this.panel = this.leftoversImageConfirmed ? -1 : 1;

      // Completed leftover
      if (panelIdComplete === 1) this.panel = !this.servingImageConfirmed ? 0 : -1;
    },

    updateServing(update: SelectedAsServedImage | null) {
      this.portionSize.serving = update;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmServing() {
      this.servingImageConfirmed = true;
      this.setPanel(0);
      this.update();
    },

    updateLeftovers(update: SelectedAsServedImage | null) {
      this.portionSize.leftovers = update;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmLeftovers() {
      this.leftoversImageConfirmed = true;
      this.setPanel(1);
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
      const state: AsServedPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
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
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
