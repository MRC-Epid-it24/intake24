<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          hide-details="auto"
          :label="$t('survey-schemes.prompts.date-picker-prompt.current')"
          name="current"
          outlined
          :value="current"
          @input="updateNumber('current', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          hide-details="auto"
          :label="$t('survey-schemes.prompts.date-picker-prompt.min')"
          name="min"
          outlined
          :value="min"
          @input="updateNumber('min', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          hide-details="auto"
          :label="$t('survey-schemes.prompts.date-picker-prompt.max')"
          name="max"
          outlined
          :value="max"
          @input="updateNumber('max', $event)"
        />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'RecallDatePrompt',

  mixins: [basePrompt],

  props: {
    current: {
      type: Number as PropType<Prompts['recall-date-prompt']['current']>,
      default: null,
    },
    min: {
      type: Number as PropType<Prompts['recall-date-prompt']['min']>,
      default: null,
    },
    max: {
      type: Number as PropType<Prompts['recall-date-prompt']['max']>,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped></style>
