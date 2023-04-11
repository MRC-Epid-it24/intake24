<template>
  <v-tab-item key="options">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.meal-gap-prompt.startTime') }}
          </v-card-title>
          <v-time-picker
            format="24hr"
            full-width
            :label="$t('survey-schemes.prompts.meal-gap-prompt.startTime')"
            :landscape="$vuetify.breakpoint.smAndUp"
            :value="startTime"
            @input="update('startTime', $event)"
          ></v-time-picker>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.meal-gap-prompt.endTime') }}
          </v-card-title>
          <v-time-picker
            format="24hr"
            full-width
            :label="$t('survey-schemes.prompts.meal-gap-prompt.endTime')"
            :landscape="$vuetify.breakpoint.smAndUp"
            :value="endTime"
            @input="update('endTime', $event)"
          ></v-time-picker>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>{{ $t('survey-schemes.prompts.meal-gap-prompt.gap') }}</v-card-title>
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.meal-gap-prompt.gap')"
            name="gap"
            outlined
            :rules="gapRules"
            :value="gap"
            @input="updateGapValue"
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
  name: 'MealGapPrompt',

  mixins: [basePrompt],

  props: {
    gap: {
      type: Number as PropType<Prompts['meal-gap-prompt']['gap']>,
      default: 180,
    },
    startTime: {
      type: String as PropType<Prompts['meal-gap-prompt']['startTime']>,
      default: '09:00',
    },
    endTime: {
      type: String as PropType<Prompts['meal-gap-prompt']['endTime']>,
      default: '21:00',
    },
  },

  computed: {
    gapRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          isInteger(value) || 'Time gap value needs to be a number.',
      ];
    },
  },

  methods: {
    updateGapValue(value: any) {
      const gapValue = parseInt(value, 10);
      this.update('gap', Number.isNaN(gapValue) ? 180 : gapValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
