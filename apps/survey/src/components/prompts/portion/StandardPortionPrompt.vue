<template>
  <portion-layout
    v-bind="{ actions, method: portionSize.method, description, text, food, isValid }"
    @action="action"
  >
    <v-expansion-panels
      v-if="Object.keys(standardUnitRefs).length"
      v-model="panel"
      flat
      :tile="isMobile"
    >
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`prompts.${portionSize.method}.label`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="unitValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group v-model="portionSize.unit" @change="selectMethod">
            <v-radio v-for="unit in standardUnits" :key="unit.name" :value="unit">
              <template #label>
                <span v-html="estimateInLabel(unit.name)"></span>
              </template>
            </v-radio>
          </v-radio-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!unitValid">
        <v-expansion-panel-header disable-icon-rotate>
          <i18n
            v-if="portionSize.unit"
            :path="`prompts.${portionSize.method}.howMany.${
              portionSize.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
          >
            <template #unit>
              <span
                v-html="getLocaleContent(standardUnitRefs[portionSize.unit.name].howMany)"
              ></span>
            </template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t(`prompts.${portionSize.method}.howMany.placeholder`) }}</template>
          <template #actions>
            <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="portionSize.quantity"
            :confirm.sync="quantityConfirmed"
            @input="selectQuantity"
            @update:confirm="confirmQuantity"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { StandardPortionPromptProps } from '@intake24/common/prompts';
import type {
  RequiredLocaleTranslation,
  StandardPortionParams,
  StandardPortionState,
  StandardPortionUnit,
} from '@intake24/common/types';
import type { StandardUnitResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { QuantityCard } from './selectors';

export type StandardUnitRefs = Record<
  string,
  { estimateIn: RequiredLocaleTranslation; howMany: RequiredLocaleTranslation }
>;

export type StandardPortionPromptState = {
  portionSize: StandardPortionState;
  panel: number;
  quantityConfirmed: boolean;
};

export default defineComponent({
  name: 'StandardPortionPrompt',

  components: { QuantityCard },

  mixins: [createBasePortion<StandardPortionPromptProps, StandardPortionPromptState>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    parameters: {
      type: Object as PropType<StandardPortionParams>,
      required: true,
    },
  },

  data() {
    return {
      standardUnitRefs: {} as StandardUnitRefs,
      ...copy(this.initialState),
    };
  },

  computed: {
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
      return !!this.portionSize.unit;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    validConditions(): boolean[] {
      return [this.unitValid, this.quantityValid];
    },
  },

  async mounted() {
    await this.fetchStandardUnits();

    if (!this.portionSize.unit && this.standardUnits.length === 1) {
      this.portionSize.unit = this.standardUnits[0];
      this.selectMethod();
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
      return this.$t(`prompts.${this.portionSize.method}.estimateIn`, {
        unit: this.getLocaleContent(this.standardUnitRefs[unit].estimateIn),
      });
    },

    selectMethod() {
      this.clearErrors();
      this.updatePanel();
      this.update();
    },

    selectQuantity() {
      this.update();
    },

    confirmQuantity() {
      this.updatePanel();
      this.update();
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight =
        (portionSize.unit?.weight ?? 0) * portionSize.quantity * this.conversionFactor;

      const state: StandardPortionPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        quantityConfirmed: this.quantityConfirmed,
      };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
