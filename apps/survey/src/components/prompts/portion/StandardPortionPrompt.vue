<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-if="standardUnitsLoaded" v-model="panel" :tile="isMobile">
      <v-expansion-panel v-show="parameters.units.length !== 1">
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.label`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="unitValid" />
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group v-model="portionSize.unit" @change="selectMethod">
            <v-radio v-for="unit in parameters.units" :key="unit.name" :value="unit">
              <template #label>
                <i18n :path="`prompts.${type}.estimateIn`">
                  <template #unit>
                    {{ getStandardUnitEstimateIn(unit) }}
                  </template>
                </i18n>
              </template>
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
              {{ getStandardUnitHowMany(portionSize.unit) }}
            </template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template v-else>
            {{ $t(`prompts.${type}.howMany.placeholder`) }}
          </template>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.quantity"
                unit=""
                :valid="quantityValid"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="portionSize.quantity"
            :confirmed.sync="quantityConfirmed"
            @input="selectQuantity"
            @update:confirmed="confirmQuantity"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <linked-quantity
        v-if="linkedParent && !linkedParent.auto"
        v-bind="{ disabled: !quantityValid, food, linkedParent, prompt }"
        v-model="portionSize.linkedQuantity"
        :confirmed.sync="linkedQuantityConfirmed"
        @input="selectLinkedQuantity"
        @update:confirmed="confirmLinkedQuantity"
      />
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';

import type { LinkedParent } from '../partials';
import { LinkedQuantity, QuantityBadge, QuantityCard, useStandardUnits } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'StandardPortionPrompt',

  components: { LinkedQuantity, QuantityBadge, QuantityCard },

  mixins: [createBasePortion<'standard-portion-prompt'>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    linkedParent: {
      type: Object as PropType<LinkedParent>,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['standard-portion']>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props) {
    const { translate } = useI18n();
    const { foodName } = useFoodUtils(props);
    const {
      resolveStandardUnits,
      getStandardUnitEstimateIn,
      getStandardUnitHowMany,
      standardUnitsLoaded,
    } = useStandardUnits();

    return {
      resolveStandardUnits,
      getStandardUnitEstimateIn,
      getStandardUnitHowMany,
      translate,
      foodName,
      standardUnitsLoaded,
    };
  },

  data() {
    return {
      ...copy(this.value),
    };
  },

  computed: {
    unitValid() {
      return !!this.portionSize.unit;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.unitValid, this.quantityValid];

      if (this.linkedParent && !this.linkedParent.auto && this.linkedParent.categories.length)
        conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  async mounted() {
    const names = this.parameters.units
      .filter(unit => unit.inlineHowMany === undefined || unit.inlineEstimateIn === undefined)
      .map(({ name }) => name);

    await this.resolveStandardUnits(names);

    if (!this.portionSize.unit && this.parameters.units.length === 1) {
      this.portionSize.unit = this.parameters.units[0];
      this.selectMethod();
    }
  },

  methods: {
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

    selectLinkedQuantity() {
      this.update();
    },

    confirmLinkedQuantity() {
      this.updatePanel();
      this.update();
    },

    update() {
      const { portionSize } = this;

      this.portionSize.servingWeight
        = (portionSize.unit?.weight ?? 0)
        * portionSize.quantity
        * this.conversionFactor
        * this.portionSize.linkedQuantity;

      const state: PromptStates['standard-portion-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        quantityConfirmed: this.quantityConfirmed,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
