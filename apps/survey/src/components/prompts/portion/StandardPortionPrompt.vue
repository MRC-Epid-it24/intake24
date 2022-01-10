<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="promptProps.description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      {{ this.selectedUnitIndex }}
      <v-expansion-panels v-model="panelOpen">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.standardPortion.portionMethodLabel', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="unitValid()">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!unitValid()">fas fa-fw fa-exclamation</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-radio-group class="py-0" v-model="selectedUnitIndex">
              <v-radio
                v-for="(opt, i) in standardUnits"
                :key="i"
                :value="i"
                :label="optionLabel(opt.name)"
                @change="onSelectMethod"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.standardPortion.label', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <quantity-card
              :whole="true"
              :fraction="true"
              @update-quantity="onUpdateQuantity"
            ></quantity-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card>
        <v-row v-if="hasErrors">
          <v-col>
            <error-alert :errors="errors"></error-alert>
          </v-col>
        </v-row>

        <v-row class="pa-2 mt-0">
          <v-col>
            <v-btn color="success" @click="submit()">Continue</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

import { QuantityValues, ValidatedPromptProps } from '@intake24/common/prompts';
import { LocaleTranslation, StandardPortionUnit } from '@intake24/common/types';
import ErrorAlert from '@intake24/survey/components/elements/ErrorAlert.vue';
import QuantityCard from '@intake24/survey/components/elements/QuantityCard.vue';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'StandardPortionPrompt',

  mixins: [BasePortion, localeContent],

  components: { ErrorAlert, QuantityCard },

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => ValidatedPromptProps,
      required: true,
    },
    foodName: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    standardUnits: {
      type: Array as () => StandardPortionUnit[],
      required: true,
    },
  },

  data() {
    return {
      errors: [] as string[],
      selectedUnitIndex: -1,
      selectedQuantity: false,
      quantityValue: {
        whole: 1,
        fraction: 0,
      },
      panelOpen: 0,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    optionLabel(unit: string) {
      return this.$t('portion.standardPortion.optionLabel', {
        unit: this.$t(`standardUnits.${unit}_estimate_in`),
      });
    },
    onSelectMethod() {
      this.clearErrors();
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    unitValid() {
      return this.selectedUnitIndex > -1;
    },
    isValid() {
      return this.unitValid();
    },
    onUpdateQuantity(value: QuantityValues) {
      this.quantityValue = value;
    },
    submit() {
      if (!this.isValid()) {
        this.errors = [
          this.getLocaleContent(this.promptProps.validation.message) ??
            this.$t('portion.standardPortion.validation.required').toString(),
        ];
        return;
      }
      this.$emit('standard-portion-selected', {
        unit: this.standardUnits[this.selectedUnitIndex],
        quantity: this.quantityValue,
      });
      this.panelOpen = -1;
      this.selectedQuantity = true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
