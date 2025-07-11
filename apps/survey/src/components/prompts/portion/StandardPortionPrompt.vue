<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-if="standardUnitsLoaded" v-model="state.panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel :readonly="portionSizeMethods.length === 1">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.method`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="psmValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <portion-size-methods
            v-bind="{ foodName, modelValue: food.portionSizeMethodIndex, portionSizeMethods }"
            @update:model-value="action('changeMethod', $event)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-show="parameters.units.length !== 1">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.label`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="unitValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-radio-group v-model="state.portionSize.unit" @update:model-value="selectMethod">
            <v-radio v-for="unit in parameters.units" :key="unit.name" :value="unit">
              <template #label>
                <i18n-t :keypath="`prompts.${type}.estimateIn`">
                  <template #unit>
                    {{ getStandardUnitEstimateIn(unit) }}
                  </template>
                </i18n-t>
              </template>
            </v-radio>
          </v-radio-group>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!unitValid">
        <v-expansion-panel-title>
          <i18n-t
            v-if="state.portionSize.unit"
            :keypath="`prompts.${type}.howMany.${
              state.portionSize.unit.omitFoodDescription ? '_' : 'withFood'
            }`"
            tag="span"
          >
            <template #unit>
              {{ getStandardUnitHowMany(state.portionSize.unit) }}
            </template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template v-else>
            {{ $t(`prompts.${type}.howMany.placeholder`) }}
          </template>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="state.portionSize.quantity"
                unit=""
                :valid="quantityValid"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <quantity-card
            v-model="state.portionSize.quantity"
            v-model:confirmed="state.quantityConfirmed"
            @update:confirmed="confirmQuantity"
            @update:model-value="selectQuantity"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <linked-quantity
        v-if="linkedParent && !linkedParent.auto"
        v-bind="{ disabled: !quantityValid, food, linkedParent, prompt }"
        v-model="state.portionSize.linkedQuantity"
        v-model:confirmed="state.linkedQuantityConfirmed"
        @update:confirmed="confirmLinkedQuantity"
        @update:model-value="selectLinkedQuantity"
      />
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { LinkedParent } from '../../handlers/composables';
import { computed, onMounted, ref } from 'vue';
import { copy } from '@intake24/common/util';
import { ExpansionPanelActions } from '@intake24/survey/components/elements';
import { useFoodUtils, usePromptUtils } from '@intake24/survey/composables';
import { BaseLayout } from '../layouts';
import { LinkedQuantity, Next, QuantityBadge, QuantityCard, usePanel, usePortionSizeMethod, useStandardUnits } from '../partials';
import { createPortionPromptProps } from '../prompt-props';
import { PortionSizeMethods } from './methods';

const props = defineProps({
  ...createPortionPromptProps<'standard-portion-prompt'>(),
  linkedParent: {
    type: Object as PropType<LinkedParent>,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, type } = usePromptUtils(props, { emit });
const { conversionFactor, parameters, psmValid } = usePortionSizeMethod<'standard-portion'>(props);
const { foodName } = useFoodUtils(props);
const {
  resolveStandardUnits,
  getStandardUnitEstimateIn,
  getStandardUnitHowMany,
  standardUnitsLoaded,
} = useStandardUnits();

const state = ref(copy(props.modelValue));

const unitValid = computed(() => !!state.value.portionSize.unit);
const quantityValid = computed(() => state.value.quantityConfirmed);
const validConditions = computed(() => {
  const conditions = [psmValid.value, unitValid.value, quantityValid.value];

  if (props.linkedParent && !props.linkedParent.auto && props.linkedParent.categories.length)
    conditions.push(state.value.linkedQuantityConfirmed);

  return conditions;
});
const isValid = computed(() => validConditions.value.every(condition => condition));

const { updatePanel } = usePanel(state, validConditions);

onMounted(async () => {
  const names = parameters.value.units.filter(unit => unit.inlineHowMany === undefined || unit.inlineEstimateIn === undefined).map(({ name }) => name);

  await resolveStandardUnits(names);

  if (!state.value.portionSize.unit && parameters.value.units.length === 1) {
    state.value.portionSize.unit = parameters.value.units[0];
    selectMethod();
  }
});

function selectMethod() {
  updatePanel();
  update();
};

function selectQuantity() {
  update();
};

function confirmQuantity() {
  updatePanel();
  update();
};

function selectLinkedQuantity() {
  update();
};

function confirmLinkedQuantity() {
  updatePanel();
  update();
};

function update() {
  const { portionSize } = state.value;

  state.value.portionSize.servingWeight
        = (portionSize.unit?.weight ?? 0)
          * portionSize.quantity
          * conversionFactor.value
          * portionSize.linkedQuantity;

  emit('update:modelValue', state.value);
};
</script>

<style lang="scss" scoped></style>
