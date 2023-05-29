<template>
  <v-tab-item key="options">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-title>{{ $t('survey-schemes.prompts.meal-duration-prompt.min') }}</v-card-title>
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.meal-duration-prompt.min')"
            name="min"
            outlined
            :rules="isNumber"
            :value="min"
            @input="updateNumberValue('min', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>{{ $t('survey-schemes.prompts.meal-duration-prompt.max') }}</v-card-title>
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.meal-duration-prompt.max')"
            name="max"
            outlined
            :rules="isNumber"
            :value="max"
            @input="updateNumberValue('max', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.meal-duration-prompt.step') }}
          </v-card-title>
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.meal-duration-prompt.step')"
            name="step"
            outlined
            :rules="isNumber"
            :value="step"
            @input="updateNumberValue('step', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.meal-duration-prompt.initial') }}
          </v-card-title>
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.meal-duration-prompt.initial')"
            name="initial"
            outlined
            :rules="isNumber"
            :value="initial"
            @input="updateNumberValue('initial', $event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isInteger from 'lodash/isInteger';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'MealDurationPrompt',

  mixins: [basePrompt],

  props: {
    initial: {
      type: Number as PropType<Prompts['meal-duration-prompt']['initial']>,
      required: true,
    },
    min: {
      type: Number as PropType<Prompts['meal-duration-prompt']['min']>,
      required: true,
    },
    max: {
      type: Number as PropType<Prompts['meal-duration-prompt']['max']>,
      required: true,
    },
    step: {
      type: Number as PropType<Prompts['meal-duration-prompt']['step']>,
      required: true,
    },
  },

  computed: {
    isNumber(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          isInteger(value) || 'Value needs to be an integer.',
      ];
    },
  },

  methods: {
    updateNumberValue(key: keyof Prompts['meal-duration-prompt'], value: any) {
      const numberValue = parseInt(value, 10);
      this.update(key, Number.isNaN(numberValue) ? 180 : numberValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
