<template>
  <v-tab-item key="options" value="options">
    <v-card-title>{{ $t('survey-schemes.prompts.submit-prompt.optionTitle') }}</v-card-title>
    <v-card-subtitle>{{
      $t('survey-schemes.prompts.submit-prompt.optionSubtitle')
    }}</v-card-subtitle>
    <v-card-text>
      <v-combobox
        v-for="key in Object.keys(review)"
        :key="key"
        :items="[false, 'checkbox', 'scroll']"
        :label="key"
        :value="review[key]"
        @change="update('review', { ...review, [key]: $event })"
      >
      </v-combobox>
    </v-card-text>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'SubmitPrompt',

  mixins: [basePrompt],

  props: {
    review: {
      type: Object as PropType<Prompts['submit-prompt']['review']>,
    },
  },
});
</script>

<style lang="scss" scoped></style>
