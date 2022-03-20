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
                    :asServedSetId="this.asServedSetId"
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
                    :asServedSetId="this.asServedSetId"
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
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { merge } from '@intake24/common/util';
import { basePromptProps, BasePromptProps } from '@intake24/common/prompts';
import { HasPartialAnswerTriggerHandler, LocaleTranslation } from '@intake24/common/types';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import AsServedSelector from '@intake24/survey/components/prompts/portion/selectors/AsServedSelector.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & HasPartialAnswerTriggerHandler & Portion>).extend({
  name: 'AsServedPrompt',

  components: {
    ValidInvalidIcon,
    AsServedSelector,
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
      asServedData: null as unknown,
      leftoverData: null as unknown,
      servingCompleteStatus: false as boolean, // Used to control the icons
      leftoverCompleteStatus: false as boolean, // Used to control the icons
      dataLoaded: false as boolean,
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
            serving: this.asServedData,
            leftovers: false,
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
    setServingStatus(status: Record<string, unknown>) {
      // Trigger by $emit from Serving (AsServedSelector)
      this.asServedData = status;
      this.servingCompleteStatus = true;
      if (this.isValid()) this.clearErrors();
      this.$emit('tempChanging', {
        modified: true,
        new: false,
        finished: false,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
        response: {
          serving: this.asServedData,
          leftovers: this.leftoverData,
        },
      });
      this.setPanelOpen(0);
    },
    setLeftoverStatus(status: Record<string, unknown>) {
      // Trigger by $emit from Leftover (AsServedSelector)
      this.leftoverData = status;
      this.leftoverCompleteStatus = true;
      if (this.isValid()) this.clearErrors();
      this.$emit('tempChanging', {
        modified: true,
        new: false,
        finished: true,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
        response: {
          serving: this.asServedData,
          leftovers: this.leftoverData,
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
      console.log('As-Served: ', this.asServedData);
      console.log('As-Served: ', this.leftoverData);
      // We can submit only as served (with no leftover)
      // Edge case: asServed and leftover completed, but leftoverPrompt answer changed to no afterwards (caught below)
      if (this.asServedData && !this.leftoverPromptAnswer) {
        // console.log("submitting only as served, leftover no");
        this.$emit('as-served-serving', this.asServedData);
      } else if (this.asServedData && this.leftoverData) {
        // Submit both as served & leftover
        // console.log("submitting as served, leftover yes");
        this.$emit('as-served-serving', this.asServedData);
        this.$emit('as-served-leftover', this.leftoverData);
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
