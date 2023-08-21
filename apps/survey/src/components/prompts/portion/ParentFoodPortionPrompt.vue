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
            <expansion-panel-actions :valid="!!portionSize.portionValue"></expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group
            v-model="portionSize.portionValue"
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
                    :valid="portionSize.portionValue === option.value"
                  ></quantity-badge>
                </template>
              </template>
            </v-radio>
          </v-radio-group>
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
        </v-expansion-panel-content>
      </v-expansion-panel>
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
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, PortionSizeParameters } from '@intake24/common/types';
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

  emits: ['input'],

  setup(props) {
    const { foodName, parentFoodName } = useFoodUtils(props);

    return { foodName, parentFoodName };
  },

  data() {
    return {
      ...copy(this.value),
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

    portionValid() {
      return this.portionSize.portionIndex !== null && this.portionSize.portionValue !== null;
    },

    validConditions(): boolean[] {
      return [this.portionValid];
    },
  },

  watch: {
    'portionSize.portionValue'(val) {
      this.portionSize.portionIndex =
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

      const state: PromptStates['parent-food-portion-prompt'] = { portionSize, panel };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
