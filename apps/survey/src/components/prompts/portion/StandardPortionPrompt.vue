<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-expansion-panels v-if="Object.keys(standardUnitRefs).length" v-model="panel" flat>
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.label`">
            <template #food>
              <span class="font-weight-medium">{{ localeFoodName }}</span>
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
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n
            v-if="portionSize.unit"
            :path="`portion.${portionSize.method}.howMany.${
              portionSize.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
          >
            <template #unit>
              <span
                v-html="getLocaleContent(standardUnitRefs[portionSize.unit.name].howMany)"
              ></span>
            </template>
            <template #food>
              <span class="font-weight-medium">{{ localeFoodName }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t(`portion.${portionSize.method}.howMany.placeholder`) }}</template>
          <template #actions>
            <valid-invalid-icon :valid="quantityValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row justify="center">
            <v-col>
              <quantity-card v-model="portionSize.quantity" fraction whole></quantity-card>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <error-alert :errors="errors"></error-alert>
            </v-col>
            <v-col md="4" xs="12">
              <v-btn block color="success" @click="confirmQuantity">
                {{ $t(`portion.${portionSize.method}.continue`) }}
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

import type { StandardPortionPromptProps } from '@intake24/common/prompts';
import type {
  RequiredLocaleTranslation,
  StandardPortionParams,
  StandardPortionState,
  StandardPortionUnit,
} from '@intake24/common/types';
import type { StandardUnitResponse } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { ErrorAlert } from '@intake24/survey/components/elements';

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

  components: { ErrorAlert, QuantityCard },

  mixins: [createBasePortion<StandardPortionPromptProps, StandardPortionPromptState>()],

  props: {
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
      return !!this.portionSize.unit;
    },

    quantityValid() {
      return this.quantityConfirmed;
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

    updatePanel() {
      if (this.isValid) {
        this.closePanels();
        return;
      }

      if (!this.unitValid) {
        this.setPanel(0);
        return;
      }

      this.setPanel(this.quantityValid ? -1 : 1);
    },

    estimateInLabel(unit: string) {
      return this.$t(`portion.${this.portionSize.method}.estimateIn`, {
        unit: this.getLocaleContent(this.standardUnitRefs[unit].estimateIn),
      });
    },

    selectMethod() {
      this.clearErrors();
      this.updatePanel();
      this.update();
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
      this.updatePanel();
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
      const { portionSize, panel, quantityConfirmed } = this;

      this.$emit('update', { portionSize, panel, quantityConfirmed });
    },
  },
});
</script>

<style lang="scss" scoped></style>
