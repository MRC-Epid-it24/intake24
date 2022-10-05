<template>
  <portion-layout v-bind="{ description, text }">
    <template #header>
      {{ localeFoodName }}
    </template>
    <v-expansion-panels v-if="Object.keys(standardUnitRefs).length" v-model="panelOpenId" flat>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n path="portion.standardPortion.label">
            <template #food>
              <span class="font-weight-medium">{{ localeFoodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="unitValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group v-model="state.unit" @change="onSelectMethod">
            <v-radio v-for="unit in standardUnits" :key="unit.name" :value="unit">
              <template #label>
                <span v-html="estimateInLabel(unit.name)"></span>
              </template>
            </v-radio>
          </v-radio-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n
            v-if="state.unit"
            :path="`portion.standardPortion.howMany.${
              state.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
          >
            <template #unit>
              <span v-html="getLocaleContent(standardUnitRefs[state.unit.name].howMany)"></span>
            </template>
            <template #food>
              <span class="font-weight-medium">{{ localeFoodName }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t('portion.standardPortion.howMany.placeholder') }}</template>
          <template #actions>
            <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row justify="center">
            <v-col>
              <quantity-card v-model="state.quantity" fraction whole></quantity-card>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <error-alert :errors="errors"></error-alert>
            </v-col>
            <v-col md="4" xs="12">
              <v-btn block color="success" @click="confirmQuantity">
                {{ $t('portion.standardPortion.continue') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!continueEnabled" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { QuantityValues, StandardPortionPromptProps } from '@intake24/common/prompts';
import type {
  LocaleTranslation,
  RequiredLocaleTranslation,
  StandardPortionUnit,
} from '@intake24/common/types';
import type { StandardPortionParams, StandardUnitResponse } from '@intake24/common/types/http';
import { standardPortionPromptDefaultProps } from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';
import { ErrorAlert, QuantityCard } from '@intake24/survey/components/elements';

import BaseExpansionPortion from './BaseExpansionPortion';

export type StandardUnitRefs = Record<
  string,
  { estimateIn: RequiredLocaleTranslation; howMany: RequiredLocaleTranslation }
>;

export type StandardPortionState = {
  unit: StandardPortionUnit | null;
  quantity: QuantityValues;
  quantityConfirmed: boolean;
};

export default defineComponent({
  name: 'StandardPortionPrompt',

  components: { ErrorAlert, QuantityCard },

  mixins: [BaseExpansionPortion],

  props: {
    initialState: {
      type: Object as PropType<StandardPortionState>,
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
      type: Object as PropType<StandardPortionParams>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<StandardPortionPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(standardPortionPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      state: copy(this.initialState),
      standardUnitRefs: {} as StandardUnitRefs,
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    standardUnits(): StandardPortionUnit[] {
      const { parameters } = this;

      const units: StandardPortionUnit[] = [];

      const unitsCount = parseInt(parameters['units-count'], 10);

      for (let i = 0; i < unitsCount; ++i) {
        units.push({
          name: parameters[`unit${i}-name`],
          weight: parseFloat(parameters[`unit${i}-weight`]),
          omitFoodDescription: parameters[`unit${i}-omit-food-description`] === 'true',
        });
      }

      return units;
    },

    unitValid() {
      return !!this.state.unit;
    },

    quantityValid() {
      return this.state.quantityConfirmed;
    },

    isValid() {
      return this.unitValid && this.quantityValid;
    },
  },

  async mounted() {
    await this.fetchStandardUnits();

    if (!this.state.unit && this.standardUnits.length === 1) {
      this.state.unit = this.standardUnits[0];
      this.onSelectMethod();
    }
  },

  methods: {
    async fetchStandardUnits() {
      const names = this.standardUnits.map(({ name }) => name);
      const { data } = await this.$http.get<StandardUnitResponse[]>(
        'portion-sizes/standard-units',
        { params: { id: names } }
      );

      this.standardUnitRefs = data.reduce<StandardUnitRefs>((acc, unit) => {
        const { id, estimateIn, howMany } = unit;

        acc[id] = { estimateIn, howMany };

        return acc;
      }, {});
    },

    estimateInLabel(unit: string) {
      return this.$t('portion.standardPortion.estimateIn', {
        unit: this.getLocaleContent(this.standardUnitRefs[unit].estimateIn),
      });
    },

    onSelectMethod() {
      this.clearErrors();
      this.setPanelOpen(1);
      this.update();
    },

    confirmQuantity() {
      this.state.quantityConfirmed = true;
      this.closeAllPanels();
      this.update();
    },

    clearErrors() {
      this.errors = [];
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
      const { unit, quantity, quantityConfirmed } = this.state;
      this.$emit('update', { unit, quantity, quantityConfirmed });
    },
  },
});
</script>

<style lang="scss" scoped></style>
