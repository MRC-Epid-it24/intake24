<template>
  <portion-layout :description="promptProps.description" :text="promptProps.text">
    <template #header>
      {{ localeDescription }}
    </template>
    <v-expansion-panels v-model="panelOpenId" flat>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n path="portion.standardPortion.label">
            <template #food>
              <span class="font-weight-medium">{{ localeDescription }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="unitValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="Object.keys(standardUnitRefs).length">
          <v-radio-group v-model="selected.unit" @change="onSelectMethod">
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
            v-if="selected.unit"
            :path="`portion.standardPortion.howMany.${
              selected.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
          >
            <template #unit>
              <span v-html="getLocaleContent(standardUnitRefs[selected.unit.name].howMany)"></span>
            </template>
            <template #food>
              <span class="font-weight-medium">{{ localeDescription }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t('portion.standardPortion.howMany.placeholder') }}</template>
          <template #actions>
            <valid-invalid-icon :valid="selectedQuantity"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row align="center" justify="center">
            <v-col>
              <quantity-card v-model="selected.quantity" fraction whole></quantity-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <error-alert :errors="errors"></error-alert>
              <v-btn block color="success" @click="confirmQuantity">
                {{ $t('portion.standardPortion.continue') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!isValid" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { QuantityValues, ValidatedPromptProps } from '@intake24/common/prompts';
import type {
  LocaleTranslation,
  RequiredLocaleTranslation,
  StandardPortionUnit,
} from '@intake24/common/types';
import type { StandardUnitResponse } from '@intake24/common/types/http';
import { ErrorAlert, QuantityCard } from '@intake24/survey/components/elements';

import BaseExpansionPortion from './BaseExpansionPortion';

export type StandardUnitRefs = Record<
  string,
  { estimateIn: RequiredLocaleTranslation; howMany: RequiredLocaleTranslation }
>;

export type SelectedUnit = {
  unit: StandardPortionUnit | null;
  quantity: QuantityValues;
};

export default defineComponent({
  name: 'StandardPortionPrompt',

  components: { ErrorAlert, QuantityCard },

  mixins: [BaseExpansionPortion],

  props: {
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<ValidatedPromptProps>,
      required: true,
    },
    standardUnits: {
      type: Array as PropType<StandardPortionUnit[]>,
      required: true,
    },
  },

  data() {
    return {
      errors: [] as string[],
      selected: {
        unit: null,
        quantity: {
          whole: 1,
          fraction: 0,
        },
      } as SelectedUnit,
      selectedQuantity: false,
      standardUnitRefs: {} as StandardUnitRefs,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    unitValid() {
      return !!this.selected.unit;
    },
    isValid() {
      return this.unitValid && this.selectedQuantity;
    },
  },

  async mounted() {
    await this.fetchStandardUnits();

    if (!this.selected.unit && this.standardUnits.length === 1)
      this.selected.unit = this.standardUnits[0];
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
    },

    clearErrors() {
      this.errors = [];
    },

    confirmQuantity() {
      this.selectedQuantity = true;
      this.closeAllPanels();
    },

    submit() {
      if (!this.isValid) {
        this.errors = [
          this.getLocaleContent(this.promptProps.validation.message) ??
            this.$t('portion.standardPortion.validation.required').toString(),
        ];
        return;
      }

      const { unit, quantity } = this.selected;
      this.$emit('standard-portion-selected', { unit, quantity });
    },
  },
});
</script>

<style lang="scss" scoped></style>
