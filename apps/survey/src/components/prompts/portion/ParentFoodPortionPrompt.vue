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
            <expansion-panel-actions :valid="!!portionSize.portionValue" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-radio-group
            v-model="portionSize.portionValue"
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
                    :valid="portionSize.portionValue === option.value"
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
  name: 'ParentFoodPortionPrompt',

  components: { QuantityBadge },

  mixins: [createBasePortion<'parent-food-portion-prompt'>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['parent-food-portion']>,
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
    category() {
      const categories = Object.keys(this.parameters.options);
      return (
        this.parentFood.data.categories.find(category => categories.includes(category))
        ?? '_default'
      );
    },

    localeOptions() {
      return (
        this.parameters.options[this.category][this.$i18n.locale]
        ?? this.parameters.options[this.category].en
      )
        .map(item => ({ ...item, value: Number(item.value) }))
        .filter(({ value }) => !Number.isNaN(value));
    },

    parentServing() {
      return this.parentFood.portionSize?.servingWeight ?? 0;
    },

    portionValid() {
      return this.portionSize.portionIndex !== null && this.portionSize.portionValue !== null;
    },

    validConditions(): boolean[] {
      return [this.portionValid];
    },
  },

  watch: {
    'portionSize.portionValue': function (val) {
      this.portionSize.portionIndex
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

      const state: PromptStates['parent-food-portion-prompt'] = { portionSize, panel };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
