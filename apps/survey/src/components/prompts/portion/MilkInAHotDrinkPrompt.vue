<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.label`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
            <template #parentFood>
              <span class="font-weight-medium">{{ parentFoodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="!!portionSize.milkVolumePercentage">
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group
            v-model="portionSize.milkVolumePercentage"
            :column="prompt.orientation === 'column'"
            :error="hasErrors"
            hide-details="auto"
            :row="prompt.orientation === 'row'"
            @change="clearErrors"
          >
            <v-radio v-for="option in localeOptions" :key="option.value" :value="option.value">
              <template #label>
                {{ option.label }}
                <template v-if="prompt.badges">
                  <v-spacer></v-spacer>
                  <quantity-badge
                    :amount="option.value * parentServing"
                    unit="ml"
                    :valid="portionSize.milkVolumePercentage === option.value"
                  ></quantity-badge>
                </template>
              </template>
            </v-radio>
          </v-radio-group>
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, PortionSizeParameters } from '@intake24/common/types';
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

  emits: ['update'],

  setup(props) {
    const { foodName, parentFoodName } = useFoodUtils(props);

    return { foodName, parentFoodName };
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    localeOptions() {
      return (this.parameters.options[this.$i18n.locale] ?? this.parameters.options.en)
        .map((item) => ({ ...item, value: Number(item.value) }))
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
    'portionSize.milkVolumePercentage'(val) {
      this.portionSize.milkPartIndex =
        this.localeOptions.findIndex((option) => option.value === val) ?? null;

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

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
