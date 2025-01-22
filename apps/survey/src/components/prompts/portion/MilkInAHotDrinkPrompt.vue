<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.label`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
            <template #parentFood>
              <span class="font-weight-medium">{{ parentFoodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="!!portionSize.milkVolumePercentage" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-radio-group
            v-model="portionSize.milkVolumePercentage"
            :error="hasErrors"
            hide-details="auto"
            :inline="prompt.orientation === 'row'"
            @update:model-value="clearErrors"
          >
            <v-radio v-for="option in localeOptions" :key="option.value" :value="option.value">
              <template #label>
                {{ option.label }}
                <template v-if="prompt.badges">
                  <v-spacer />
                  <quantity-badge
                    :amount="option.value * parentServing"
                    unit="ml"
                    :valid="portionSize.milkVolumePercentage === option.value"
                  />
                </template>
              </template>
            </v-radio>
          </v-radio-group>
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error" />
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
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, PortionSizeParameters } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';

import { QuantityBadge } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  components: { QuantityBadge },

  mixins: [createBasePortion<'milk-in-a-hot-drink-prompt'>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['milk-in-a-hot-drink']>,
      required: true,
    },
    parentFood: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const { foodName, parentFoodName } = useFoodUtils(props);

    return { foodName, parentFoodName };
  },

  data() {
    return {
      ...copy(this.modelValue),
    };
  },

  computed: {
    localeOptions() {
      return (this.parameters.options[this.$i18n.locale] ?? this.parameters.options.en)
        .map(item => ({ ...item, value: Number(item.value) }))
        .filter(({ value }) => !Number.isNaN(value));
    },

    parentServing() {
      return this.parentFood.portionSize?.servingWeight ?? 0;
    },

    milkValid() {
      return (
        this.portionSize.milkPartIndex !== null && this.portionSize.milkVolumePercentage !== null
      );
    },

    validConditions(): boolean[] {
      return [this.milkValid];
    },
  },

  watch: {
    'portionSize.milkVolumePercentage': function (val) {
      this.portionSize.milkPartIndex
        = this.localeOptions.findIndex(option => option.value === val) ?? null;

      this.updatePanel();
      this.update();
    },
  },

  methods: {
    setErrors() {
      this.errors = [];
    },

    update() {
      const { portionSize, panel } = this;

      const state: PromptStates['milk-in-a-hot-drink-prompt'] = { portionSize, panel };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
