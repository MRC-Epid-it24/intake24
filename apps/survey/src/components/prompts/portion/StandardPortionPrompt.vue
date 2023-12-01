<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-if="translationsLoaded" v-model="panel" :tile="isMobile">
      <v-expansion-panel v-show="standardUnits.length !== 1">
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
            <v-radio v-for="unit in standardUnits" :key="unit.name" :value="unit">
              <template #label>
                <i18n :path="`prompts.${type}.estimateIn`">
                  <template #unit>
                    {{ translate(unit.inlineEstimateIn ?? standardUnitRefs[unit.name].estimateIn) }}
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
              {{
                translate(
                  portionSize.unit.inlineHowMany ?? standardUnitRefs[portionSize.unit.name].howMany
                )
              }}
            </template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template v-else>{{ $t(`prompts.${type}.howMany.placeholder`) }}</template>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.quantity"
                unit=""
                :valid="quantityValid"
              ></quantity-badge>
            </expansion-panel-actions>
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
      <linked-quantity
        v-if="linkedQuantity"
        v-bind="{ disabled: !quantityValid, food, linkedQuantity, prompt }"
        v-model="portionSize.linkedQuantity"
        :confirm.sync="linkedQuantityConfirmed"
        @input="selectLinkedQuantity"
        @update:confirm="confirmLinkedQuantity"
      ></linked-quantity>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters, StandardPortionUnit } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils } from '@intake24/survey/composables';

import type { LinkedQuantityFood } from '../partials';
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
    linkedQuantity: {
      type: Object as PropType<LinkedQuantityFood>,
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
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const usingStandardTranslations = ref<boolean>(true);

    return { standardUnitRefs, fetchStandardUnits, translate, foodName, usingStandardTranslations };
  },

  data() {
    return {
      ...copy(this.value),
    };
  },

  computed: {
    standardUnits(): StandardPortionUnit[] {
      const { parameters } = this;

      const units: StandardPortionUnit[] = [];

      const unitsCount = parseInt(parameters['units-count']);

      for (let i = 0; i < unitsCount; ++i) {
        units.push({
          name: parameters[`unit${i}-name`],
          weight: parameters[`unit${i}-weight`],
          omitFoodDescription: parameters[`unit${i}-omit-food-description`],
          inlineHowMany: parameters[`unit${i}-inline-how-many`],
          inlineEstimateIn: parameters[`unit${i}-inline-estimate-in`],
        });
      }

      return units;
    },

    translationsLoaded(): boolean {
      return this.usingStandardTranslations ? Object.keys(this.standardUnitRefs).length > 0 : true;
    },

    unitValid() {
      return !!this.portionSize.unit;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.unitValid, this.quantityValid];

      if (this.linkedQuantity?.categories.length) conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  async mounted() {
    const names = this.standardUnits
      .filter((unit) => unit.inlineHowMany === undefined || unit.inlineEstimateIn === undefined)
      .map(({ name }) => name);

    if (names.length > 0) {
      await this.fetchStandardUnits(names);
    } else {
      this.usingStandardTranslations = false;
    }

    if (!this.portionSize.unit && this.standardUnits.length === 1) {
      this.portionSize.unit = this.standardUnits[0];
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

      this.portionSize.servingWeight =
        (portionSize.unit?.weight ?? 0) *
        portionSize.quantity *
        this.conversionFactor *
        this.portionSize.linkedQuantity;

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
