<template>
  <base-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels
      v-if="Object.keys(standardUnitRefs).length"
      v-model="panel"
      :tile="isMobile"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.label`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="unitValid"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group v-model="portionSize.unit" @change="selectMethod">
            <v-radio
              v-for="unit in standardUnits"
              :key="unit.name"
              :label="estimateInLabel(unit.name)"
              :value="unit"
            >
            </v-radio>
          </v-radio-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!unitValid">
        <v-expansion-panel-header>
          <i18n
            v-if="portionSize.unit"
            :path="`prompts.${type}.howMany.${
              portionSize.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
          >
            <template #unit>
              {{ getLocaleContent(standardUnitRefs[portionSize.unit.name].howMany) }}
            </template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t(`prompts.${type}.howMany.placeholder`) }}</template>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid"></expansion-panel-actions>
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
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters, StandardPortionUnit } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

import { useStandardUnits } from '../useStandardUnits';
import createBasePortion from './createBasePortion';
import { QuantityCard } from './selectors';

export default defineComponent({
  name: 'StandardPortionPrompt',

  components: { QuantityCard },

  mixins: [createBasePortion<'standard-portion-prompt'>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['standard-portion']>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { food } = toRefs(props);

    const { getLocaleContent } = useLocale();
    const { foodName } = useFoodUtils(food);
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    return { standardUnitRefs, fetchStandardUnits, getLocaleContent, foodName };
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    standardUnits(): StandardPortionUnit[] {
      const { parameters } = this;

      const units: StandardPortionUnit[] = [];

      const unitsCount = Math.floor(Object.keys(parameters).length / 3);

      for (let i = 0; i < unitsCount; ++i) {
        units.push({
          name: parameters[`unit${i}-name`],
          weight: parameters[`unit${i}-weight`],
          omitFoodDescription: parameters[`unit${i}-omit-food-description`],
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
    const names = this.standardUnits.map(({ name }) => name);
    await this.fetchStandardUnits(names);

    if (!this.portionSize.unit && this.standardUnits.length === 1) {
      this.portionSize.unit = this.standardUnits[0];
      this.selectMethod();
    }
  },

  methods: {
    estimateInLabel(unit: string) {
      return this.$t(`prompts.${this.type}.estimateIn`, {
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

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight =
        (portionSize.unit?.weight ?? 0) * portionSize.quantity * this.conversionFactor;

      const state: PromptStates['standard-portion-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        quantityConfirmed: this.quantityConfirmed,
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
