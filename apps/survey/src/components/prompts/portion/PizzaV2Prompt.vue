<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="state.panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.sizes.label`) }}
          <template #actions>
            <expansion-panel-actions :valid="sizeValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex flex-column">
            <v-radio-group
              v-model="state.portionSize.size"
              hide-details="auto"
              @update:model-value="confirmType('size', false)"
            >
              <v-radio
                v-for="option in sizeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </v-radio-group>
            <v-btn
              :block="$vuetify.display.mobile"
              class="align-self-stretch align-self-md-start mt-6"
              color="primary"
              :disabled="!state.portionSize.size"
              @click="confirmType('size', true)"
            >
              {{ $t('common.action.continue') }}
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!sizeValid">
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.crusts.label`) }}
          <template #actions>
            <expansion-panel-actions :valid="crustValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex flex-column gr-4">
            <v-radio-group
              v-model="state.portionSize.crust"
              hide-details="auto"
              @update:model-value="confirmType('crust', false)"
            >
              <v-radio
                v-for="option in crustOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </v-radio-group>
            <v-btn
              :block="$vuetify.display.mobile"
              class="align-self-stretch align-self-md-start"
              color="primary"
              :disabled="!state.portionSize.crust"
              @click="confirmType('crust', true)"
            >
              {{ $t('common.action.continue') }}
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!crustValid">
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.units.label`) }}
          <template #actions>
            <expansion-panel-actions :valid="unitValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-item-group
            v-model="state.portionSize.unit"
            class="d-flex flex-row gc-2"
            :mandatory="!!state.portionSize.unit"
          >
            <v-container>
              <v-row>
                <v-col v-for="unit in unitOptions" :key="unit.value" cols="6">
                  <v-item v-slot="{ isSelected, toggle }" :value="unit.value">
                    <v-hover v-slot="{ isHovering }">
                      <v-card
                        class="d-flex flex-column gr-5 align-stretch justify-center pa-5 text-center rounded-xxl"
                        :color="isSelected || isHovering ? 'ternary' : ''"
                        flat
                        @click="
                          () => {
                            toggle && toggle();
                            confirmType('unit', true);
                          }
                        "
                      >
                        <span class="text-center">
                          <component
                            :is="`pizza-${unit.value}`"
                            class="pizza-unit__svg"
                          />
                        </span>
                        <span class="font-weight-bold text-uppercase">
                          {{ $t(`prompts.${type}.units.${unit.value}`) }}
                        </span>
                      </v-card>
                    </v-hover>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel :disabled="!unitValid">
        <v-expansion-panel-title>
          {{ $t(`prompts.${type}.quantity.${state.portionSize.unit ?? 'slice'}`) }}
          <template #actions>
            <expansion-panel-actions :valid="quantityValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-container>
            <v-row>
              <v-col class="d-none d-sm-flex justify-center align-center" cols="6">
                <component
                  :is="`pizza-${state.portionSize.unit}`"
                  class="pizza-unit__svg"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <quantity-card
                  v-model="state.portionSize.quantity"
                  @update:confirmed="confirmType('quantity', $event)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-text>
      </v-expansion-panel>
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
// @ts-expect-error - virtual types
import PizzaSlice from 'virtual:icons/fluent/food-pizza-24-filled';
// @ts-expect-error - virtual types
import PizzaWhole from 'virtual:icons/game-icons/full-pizza';
import { computed, defineComponent, ref } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import type { EncodedFood, RecipeBuilder } from '@intake24/common/types';
import { pizzaCrusts, pizzaSizes, pizzaUnits } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions, ValidInvalidIcon } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { QuantityCard, usePanel } from '../partials';

const baseWeight = 198;

const pizzaDefs = {
  personal: { slices: 4, multiplier: 1 },
  small: { slices: 6, multiplier: 2 },
  medium: { slices: 8, multiplier: 3 },
  large: { slices: 10, multiplier: 4 },
  xxl: { slices: 12, multiplier: 6 },
};

const crustDefs = { classic: 1, 'italian-thin': 0.8, stuffed: 1.2 };

export default defineComponent({
  name: 'PizzaV2Prompt',

  components: { PizzaSlice, PizzaWhole, QuantityCard, ExpansionPanelActions, ValidInvalidIcon },

  mixins: [createBasePrompt<'pizza-v2-prompt'>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    parentFood: {
      type: Object as PropType<EncodedFood | RecipeBuilder>,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['pizza-v2']>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<PromptStates['pizza-v2-prompt']>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: { t } } = useI18n();
    const { action, type } = usePromptUtils(props, ctx);

    const state = ref(copy(props.modelValue));

    const sizeValid = computed(() => state.value.confirmed.size);
    const crustValid = computed(() => state.value.confirmed.crust);
    const unitValid = computed(() => state.value.confirmed.unit);
    const quantityValid = computed(() => state.value.confirmed.quantity);
    const validConditions = computed(() => [
      sizeValid.value,
      crustValid.value,
      unitValid.value,
      quantityValid.value,
    ]);
    const isValid = computed(() => validConditions.value.every(condition => condition));

    const { updatePanel } = usePanel(state, validConditions);

    const sizeOptions = computed(() =>
      pizzaSizes.map(value => ({
        label: t(`prompts.${type.value}.sizes.${value}`),
        value,
      })),
    );

    const crustOptions = computed(() =>
      pizzaCrusts.map(value => ({
        label: t(`prompts.${type.value}.crusts.${value}`),
        value,
      })),
    );

    const unitOptions = computed(() =>
      pizzaUnits.map(value => ({
        label: t(`prompts.${type.value}.units.${value}`),
        value,
      })),
    );

    const update = () => {
      const { size, crust, unit, quantity } = state.value.portionSize;
      if ([size, crust, unit, quantity].every(item => item)) {
        state.value.portionSize.servingWeight
          = ((baseWeight * pizzaDefs[size!].multiplier * crustDefs[crust!])
            / (unit === 'slice' ? pizzaDefs[size!].slices : 1))
            * quantity
            * props.conversionFactor;
      }

      ctx.emit('update:modelValue', state.value);
    };

    const confirmType = (type: 'size' | 'crust' | 'unit' | 'quantity', value: boolean) => {
      state.value.confirmed[type] = value;
      updatePanel();
      update();
    };

    return {
      action,
      confirmType,
      crustOptions,
      crustValid,
      isValid,
      quantityValid,
      sizeOptions,
      sizeValid,
      state,
      type,
      unitOptions,
      unitValid,
      update,
      updatePanel,
    };
  },
});
</script>

<style lang="scss" scoped>
.pizza-unit__svg {
  height: auto;
  width: 100%;
  max-width: 150px;
}
</style>
