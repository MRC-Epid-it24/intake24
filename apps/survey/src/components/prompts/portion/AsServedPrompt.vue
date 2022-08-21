<template>
  <portion-layout id="test" :text="promptProps.text" :description="promptProps.description">
    <template #headerText>
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
                  :weight="asServedData?.weight"
                  :valid="servingCompleteStatus"
                ></as-served-weight>
                <valid-invalid-icon :valid="servingCompleteStatus"></valid-invalid-icon>
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
                    :as-served-set-id="asServedSetId"
                    :initial-state="initialState.servingImage?.index"
                    @update="onServingUpdate"
                    @confirm="onServingConfirmed"
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
                  :weight="leftoverPromptAnswer ? leftoverData?.weight : 0"
                  :valid="leftoverCompleteStatus"
                ></as-served-weight>
                <valid-invalid-icon :valid="leftoverCompleteStatus"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <p>
                    {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                  </p>
                  <v-btn :color="leftoverButtonStyle('yes')" @click="leftoverAnswer(true)">
                    {{ $t('common.action.confirm.yes') }}
                  </v-btn>
                  <v-btn :color="leftoverButtonStyle('no')" @click="leftoverAnswer(false)">
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
                  <!-- This currently is taking asServed data, not the leftover data -->
                  <as-served-selector
                    :as-served-set-id="asServedSetId"
                    :initial-state="initialState.leftoversImage?.index"
                    @update="onLeftoversUpdate"
                    @confirm="onLeftoversConfirmed"
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
    <v-row>
      <v-col xs="12" md="3">
        <continue :disabled="!continueEnabled" @click="submit()">
          {{ $t('common.action.continue') }}
        </continue>
      </v-col>
    </v-row>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation, SelectedAsServedImage } from '@intake24/common/types';
import { basePromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import AsServedWeight from '@intake24/survey/components/elements/AsServedWeight.vue';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import { localeContent } from '@intake24/survey/components/mixins';
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

  components: {
    ValidInvalidIcon,
    AsServedSelector,
    AsServedWeight,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    asServedSetId: {
      type: String,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    initialState: {
      type: Object as PropType<AsServedPromptState>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      panelOpen: this.initialState.activePanel,
      leftoverPromptAnswer: this.initialState.leftoversConfirmed,
      // selectionImageData: {} as AsServedSetResponse,
      servingIdx: this.initialState.servingImage?.index,
      asServedData: this.initialState.servingImage,
      leftoverData: this.initialState.leftoversImage,
      servingCompleteStatus: this.initialState.servingImageSelected,
      leftoverCompleteStatus:
        this.initialState.leftoversConfirmed === false || this.initialState.leftoversImageSelected,
      dataLoaded: false as boolean,
      finished: false,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
  },

  methods: {
    leftoverAnswer(answer: boolean) {
      // Controls display of leftover selector
      this.leftoverCompleteStatus = !answer;
      this.leftoverPromptAnswer = answer;
      this.emitUpdate();
    },
    leftoverButtonStyle(buttonValue: string): string {
      // Make button green for currently selection option
      if (this.leftoverPromptAnswer === null) return '';
      if (buttonValue === 'yes' && this.leftoverPromptAnswer) {
        return 'success';
      }
      if (buttonValue === 'no' && !this.leftoverPromptAnswer) {
        return 'success';
      }
      return '';
    },

    setPanelOpen(panelIdComplete: number) {
      if (this.isValid()) {
        this.panelOpen = -1;
        return;
      }
      // Completed asServed
      if (panelIdComplete === 0) {
        if (this.leftoverCompleteStatus) {
          this.panelOpen = -1;
        } else {
          this.panelOpen = 1;
        }
      }
      // Completed leftover
      if (panelIdComplete === 1) {
        if (!this.servingCompleteStatus) {
          this.panelOpen = 0;
        } else {
          this.panelOpen = -1;
        }
      }
    },
    onServingUpdate(update: SelectedAsServedImage | null) {
      this.asServedData = update;
      this.servingWeight = this.asServedData?.weight || 0;
      if (this.isValid()) this.clearErrors();
      this.emitUpdate();
    },

    onServingConfirmed() {
      this.servingCompleteStatus = true;
      this.setPanelOpen(0);
      this.emitUpdate();
    },

    onLeftoversUpdate(update: SelectedAsServedImage | null) {
      this.leftoverData = update;
      this.leftoversWeight = this.leftoverData?.weight || 0;
      if (this.isValid()) this.clearErrors();
      this.emitUpdate();
    },

    onLeftoversConfirmed() {
      this.leftoverCompleteStatus = true;
      this.setPanelOpen(1);
      this.emitUpdate();
    },

    onActivePanelChanged() {
      this.emitUpdate();
    },

    isValid(): boolean {
      // Haven't filled in asServed, or answered leftover
      if (!this.asServedData || this.leftoverPromptAnswer === null) return false;

      // asServed is complete, leftoverPromptAnswer is false (no leftover)
      if (this.asServedData && this.leftoverPromptAnswer === false) {
        return true;
      }
      // Both asServed and leftoverData are full
      if (this.asServedData && this.leftoverData) {
        return true;
      }
      return false;
    },
    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },
    clearErrors() {
      this.errors = [];
    },
    submit() {
      if (!this.isValid()) {
        this.setErrors();
        return;
      }

      this.$emit('continue');
    },

    // what's this for?
    partialAnswerHandler() {
      this.setPanelOpen(this.panelOpen || 0);
    },

    emitUpdate() {
      const newState: AsServedPromptState = {
        activePanel: this.panelOpen,
        servingImage: this.asServedData,
        servingImageSelected: this.servingCompleteStatus,
        leftoversConfirmed: this.leftoverPromptAnswer,
        leftoversImage: this.leftoverData,
        leftoversImageSelected: this.leftoverCompleteStatus,
      };

      this.$emit('update', newState);
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
