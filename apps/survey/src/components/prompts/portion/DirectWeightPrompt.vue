<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="portionSize.quantity"
            hide-details="auto"
            :label="$t('prompts.quantity._')"
            name="quantity"
            prepend-inner-icon="fas fa-weight-scale"
            :rules="rules"
            @update:model-value="update"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isNumber from 'lodash/isNumber';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'DirectWeightPrompt',

  mixins: [createBasePortion<'direct-weight-prompt'>()],

  props: {
    conversionFactor: {
      type: Number,
      required: true,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['direct-weight']>,
      required: true,
    },
    max: {
      type: Number,
      default: 10000,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const validateInput = (value: any) => isNumber(value) && value > 0 && value < props.max;

    return { validateInput };
  },

  data() {
    return {
      ...copy(this.modelValue),
    };
  },

  computed: {
    rules() {
      return [
        (value: any): boolean | string => this.validateInput(value),
      ];
    },
    quantityValid() {
      return this.validateInput(this.portionSize.quantity);
    },

    validConditions(): boolean[] {
      const conditions = [this.quantityValid];

      return conditions;
    },
  },

  methods: {
    update() {
      const { portionSize: { quantity } } = this;

      this.portionSize.servingWeight = isNumber(quantity) ? quantity * this.conversionFactor : null;

      const state: PromptStates['direct-weight-prompt'] = {
        portionSize: this.portionSize,
      };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
