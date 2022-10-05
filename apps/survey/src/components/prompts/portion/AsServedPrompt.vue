<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat @change="onActivePanelChanged">
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.serving.header`) }}
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
                  {{ $t(`portion.${method}.serving.label`, { food: localeFoodName }) }}
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
          <v-expansion-panel v-if="parameters['leftovers-image-set']">
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.leftover.header`, { food: localeFoodName }) }}
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
                    {{ $t(`portion.${method}.leftover.question`, { food: localeFoodName }) }}
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
              <template v-if="leftoverPromptAnswer">
                <v-row>
                  <v-col>
                    {{ $t(`portion.${method}.leftover.label`, { food: localeFoodName }) }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <as-served-selector
                      :as-served-set-id="parameters['leftovers-image-set']"
                      :initial-state="initialState.leftoversImage?.index"
                      :type="'leftover'"
                      @confirm="leftoversConfirmed"
                      @update="leftoversUpdate"
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
import type { SelectedAsServedImage } from '@intake24/common/types';
import type { AsServedParameters } from '@intake24/common/types/http';
import { AsServedWeight } from '@intake24/survey/components/elements';
import AsServedSelector from '@intake24/survey/components/prompts/portion/selectors/AsServedSelector.vue';

import createBasePortion from './createBasePortion';

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
      method: 'as-served',
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
    hasLeftovers() {
      return !!this.parameters['leftovers-image-set'];
    },

    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    isValid(): boolean {
      // Haven't filled in asServed
      if (!this.asServedData || !this.servingCompleteStatus) return false;

      // Food has no leftovers or leftovers have been confirmed
      if (!this.hasLeftovers || this.leftoverPromptAnswer === false) return true;

      // Haven't filled in leftovers
      if (!this.leftoverData || !this.leftoverCompleteStatus) return false;

      return true;
    },
  },

  methods: {
    leftoverAnswer(answer: boolean) {
      // Controls display of leftover selector
      this.leftoverCompleteStatus = !answer;
      this.leftoverPromptAnswer = answer;
      this.update();
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

      this.update();
    },

    servingConfirmed() {
      this.servingCompleteStatus = true;
      this.setPanelOpen(0);
      this.update();
    },

    leftoversUpdate(update: SelectedAsServedImage | null) {
      this.leftoverData = update;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    leftoversConfirmed() {
      this.leftoverCompleteStatus = true;
      this.setPanelOpen(1);
      this.update();
    },

    onActivePanelChanged() {
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
