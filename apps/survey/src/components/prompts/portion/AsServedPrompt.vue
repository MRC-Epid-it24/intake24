<template>
  <portion-layout :text="promptProps.text" :description="promptProps.description" id="test">
    <template v-slot:headerText>
      {{ $t('portion.asServed.promptLabel', { food: localeDescription }) }}
    </template>
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t('portion.asServed.portionHeader') }}
              <template v-slot:actions>
                <as-served-weight
                  :weight="servingWeight"
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
                    :asServedSetId="asServedSetId"
                    @as-served-selector-submit="setServingStatus($event)"
                  ></as-served-selector>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t('portion.asServed.leftoverHeader', { food: localeDescription }) }}
              <template v-slot:actions>
                <as-served-weight
                  :weight="leftoversWeight"
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
                  <v-btn @click="leftoverAnswer(true)" :color="leftoverButtonStyle('yes')">
                    {{ $t('common.action.confirm.yes') }}
                  </v-btn>
                  <v-btn @click="leftoverAnswer(false)" :color="leftoverButtonStyle('no')">
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
                    :asServedSetId="asServedSetId"
                    @as-served-selector-submit="setLeftoverStatus($event)"
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
        <v-btn @click="submit()" :color="submitButtonStyle()" block>
          {{ $t('common.action.continue') }}
        </v-btn>
      </v-col>
    </v-row>
  </portion-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { merge } from '@intake24/common/util';
import type { BasePromptProps } from '@intake24/common/prompts';
import { basePromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation, SelectedAsServedImage } from '@intake24/common/types';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import AsServedWeight from '@intake24/survey/components/elements/AsServedWeight.vue';
import AsServedSelector from '@intake24/survey/components/prompts/portion/selectors/AsServedSelector.vue';
import BasePortion from './BasePortion';

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
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      panelOpen: 0 as number,
      leftoverPromptAnswer: null as unknown,
      // selectionImageData: {} as AsServedSetResponse,
      servingIdx: null as number | null,
      asServedData: null as SelectedAsServedImage | null,
      leftoverData: null as SelectedAsServedImage | null,
      servingCompleteStatus: false as boolean, // Used to control the icons
      leftoverCompleteStatus: false as boolean, // Used to control the icons
      dataLoaded: false as boolean,
      servingWeight: 0 as number,
      leftoversWeight: 0 as number,
      finished: false,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealIndex', 'selectedFoodIndex', 'currentTempPromptAnswer']),

    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
  },

  methods: {
    leftoverAnswer(answer: boolean) {
      // Controls display of leftover selector
      this.leftoverPromptAnswer = answer;
      this.finished = true;
      if (answer === false) {
        // 'no' answer makes form valid, so make ready for submit
        this.leftoverData = null;
        this.leftoverCompleteStatus = true;
        this.clearErrors();
        this.setPanelOpen(1);
        this.$emit('tempChanging', {
          modified: true,
          new: false,
          finished: true,
          mealIndex: this.selectedMealIndex,
          foodIndex: this.selectedFoodIndex,
          prompt: this.promptComponent,
          response: {
            selectedServing: this.asServedData,
            selectedLeftovers: false,
          },
        });
      } else {
        this.leftoverCompleteStatus = false;
      }
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
    submitButtonStyle(): string {
      if (this.servingCompleteStatus && this.leftoverCompleteStatus) return 'success';
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
    setServingStatus(status: SelectedAsServedImage) {
      // Trigger by $emit from Serving (AsServedSelector)
      this.asServedData = status || null;
      this.servingCompleteStatus = true;
      this.servingWeight = this.asServedData.weight;
      if (this.isValid()) this.clearErrors();
      this.$emit('tempChanging', {
        modified: true,
        new: false,
        finished: this.finished,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
        response: {
          selectedServing: this.asServedData,
          selectedLeftovers: this.leftoverData,
        },
      });
      this.setPanelOpen(0);
    },
    setLeftoverStatus(status: SelectedAsServedImage) {
      // Trigger by $emit from Leftover (AsServedSelector)
      this.leftoverData = status || null;
      this.leftoverCompleteStatus = true;
      this.leftoversWeight = this.leftoverData.weight;
      if (this.isValid()) this.clearErrors();
      this.finished = true;
      this.$emit('tempChanging', {
        modified: true,
        new: false,
        finished: this.finished,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
        response: {
          selectedServing: this.asServedData,
          selectedLeftovers: this.leftoverData,
        },
      });
      this.setPanelOpen(1);
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
      // We can submit only as served (with no leftover)
      // Edge case: asServed and leftover completed, but leftoverPrompt answer changed to no afterwards (caught below)
      if (this.asServedData && !this.leftoverPromptAnswer) {
        // console.log("submitting only as served, leftover no");
        this.$emit('as-served-leftovers', {
          selectedServing: this.asServedData,
          selectedLeftovers: false,
        });
      } else if (this.asServedData && this.leftoverData) {
        // Submit both as served & leftover
        // console.log("submitting as served, leftover yes");
        this.$emit('as-served-leftovers', {
          selectedServing: this.asServedData,
          selectedLeftovers: this.leftoverData,
        });
      }
    },

    partialAnswerHandler() {
      this.setPanelOpen(this.panelOpen);
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
