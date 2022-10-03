<template>
  <portion-layout :description="promptProps.description" :text="promptProps.text">
    <template #header>
      {{ $t('portion.asServed.promptLabel', { food: localeDescription }) }}
    </template>
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat @change="onActivePanelChanged">
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t('portion.asServed.portionHeader') }}
              <template #actions>
                <as-served-weight
                  :valid="servingCompleteStatus"
                  :weight="asServedData?.weight"
                ></as-served-weight>
                <valid-invalid-icon
                  class="ml-1"
                  :valid="servingCompleteStatus"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  {{ $t('portion.asServed.portionLabel', { food: localeDescription }) }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <as-served-selector
                    :as-served-set-id="parameters['serving-image-set']"
                    :initial-state="initialState.servingImage?.index"
                    @confirm="servingConfirmed"
                    @update="servingUpdate"
                  ></as-served-selector>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t('portion.asServed.leftoverHeader', { food: localeDescription }) }}
              <template #actions>
                <as-served-weight
                  :valid="leftoverCompleteStatus"
                  :weight="leftoverPromptAnswer ? leftoverData?.weight : 0"
                ></as-served-weight>
                <valid-invalid-icon
                  class="ml-1"
                  :valid="leftoverCompleteStatus"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <p>
                    {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                  </p>
                  <v-btn
                    :color="leftoverPromptAnswer === true ? 'success' : ''"
                    @click="leftoverAnswer(true)"
                  >
                    {{ $t('common.action.confirm.yes') }}
                  </v-btn>
                  <v-btn
                    class="ml-2"
                    :color="leftoverPromptAnswer === false ? 'success' : ''"
                    @click="leftoverAnswer(false)"
                  >
                    {{ $t('common.action.confirm.no') }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-if="leftoverPromptAnswer">
                <v-col>
                  {{ $t('portion.asServed.leftoverHeader', { food: localeDescription }) }}
                </v-col>
              </v-row>
              <v-row v-if="leftoverPromptAnswer">
                <v-col>
                  <as-served-selector
                    :as-served-set-id="parameters['leftovers-image-set']"
                    :initial-state="initialState.leftoversImage?.index"
                    @confirm="leftoversConfirmed"
                    @update="leftoversUpdate"
                  ></as-served-selector>
                </v-col>
              </v-row>
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

import type { BasePromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation, SelectedAsServedImage } from '@intake24/common/types';
import type { AsServedParameters } from '@intake24/common/types/http';
import { basePromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { AsServedWeight, ValidInvalidIcon } from '@intake24/survey/components/elements';
import AsServedSelector from '@intake24/survey/components/prompts/portion/selectors/AsServedSelector.vue';

import BasePortion from './BasePortion';

export interface AsServedPromptState {
  activePanel: number | null;
  servingImage: SelectedAsServedImage | null;
  servingImageSelected: boolean;
  leftoversConfirmed: boolean | null;
  leftoversImage: SelectedAsServedImage | null;
  leftoversImageSelected: boolean;
}

export default defineComponent({
  name: 'AsServedPrompt',

  components: { AsServedSelector, AsServedWeight, ValidInvalidIcon },

  mixins: [BasePortion],

  props: {
    initialState: {
      type: Object as PropType<AsServedPromptState>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    parameters: {
      type: Object as PropType<AsServedParameters>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      panelOpen: this.initialState.activePanel,
      leftoverPromptAnswer: this.initialState.leftoversConfirmed,
      asServedData: this.initialState.servingImage,
      leftoverData: this.initialState.leftoversImage,
      servingCompleteStatus: this.initialState.servingImageSelected,
      leftoverCompleteStatus:
        this.initialState.leftoversConfirmed === false || this.initialState.leftoversImageSelected,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    isValid(): boolean {
      // Haven't filled in asServed, or answered leftover
      if (!this.asServedData || this.leftoverPromptAnswer === null) return false;

      // asServed is complete, leftoverPromptAnswer is false (no leftover)
      if (this.asServedData && this.leftoverPromptAnswer === false) return true;

      // Both asServed and leftoverData are full
      if (this.asServedData && this.leftoverData) return true;

      return false;
    },
  },

  methods: {
    leftoverAnswer(answer: boolean) {
      // Controls display of leftover selector
      this.leftoverCompleteStatus = !answer;
      this.leftoverPromptAnswer = answer;
      this.emitUpdate();
    },

    setPanelOpen(panelIdComplete: number) {
      if (this.isValid) {
        this.panelOpen = -1;
        return;
      }

      // Completed asServed
      if (panelIdComplete === 0) this.panelOpen = this.leftoverCompleteStatus ? -1 : 1;

      // Completed leftover
      if (panelIdComplete === 1) this.panelOpen = !this.servingCompleteStatus ? 0 : -1;
    },

    servingUpdate(update: SelectedAsServedImage | null) {
      this.asServedData = update;

      if (this.isValid) this.clearErrors();

      this.emitUpdate();
    },

    servingConfirmed() {
      this.servingCompleteStatus = true;
      this.setPanelOpen(0);
      this.emitUpdate();
    },

    leftoversUpdate(update: SelectedAsServedImage | null) {
      this.leftoverData = update;

      if (this.isValid) this.clearErrors();

      this.emitUpdate();
    },

    leftoversConfirmed() {
      this.leftoverCompleteStatus = true;
      this.setPanelOpen(1);
      this.emitUpdate();
    },

    onActivePanelChanged() {
      this.emitUpdate();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    clearErrors() {
      this.errors = [];
    },

    submit() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('continue');
    },

    emitUpdate() {
      this.$emit('update', {
        activePanel: this.panelOpen,
        servingImage: this.asServedData,
        servingImageSelected: this.servingCompleteStatus,
        leftoversConfirmed: this.leftoverPromptAnswer,
        leftoversImage: this.leftoverData,
        leftoversImageSelected: this.leftoverCompleteStatus,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
