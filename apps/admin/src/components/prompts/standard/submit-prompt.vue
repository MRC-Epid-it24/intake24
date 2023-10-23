<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-card-title>{{ $t('survey-schemes.prompts.submit-prompt.review.title') }}</v-card-title>
        <v-card-subtitle>
          {{ $t('survey-schemes.prompts.submit-prompt.review.subtitle') }}
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col></v-col>
          </v-row>
          <v-select
            v-for="key in Object.keys(review)"
            :key="key"
            :items="options"
            :label="$t(`survey-schemes.actions.layouts.${key}`)"
            outlined
            :prepend-inner-icon="`$${key}`"
            :value="review[key]"
            @change="update('review', { ...review, [key]: $event })"
          >
          </v-select>
        </v-card-text>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { reviewOptions } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'SubmitPrompt',

  mixins: [basePrompt],

  props: {
    review: {
      type: Object as PropType<Prompts['submit-prompt']['review']>,
      required: true,
    },
  },

  setup() {
    const { i18n } = useI18n();

    const options = reviewOptions.map((value) => ({
      text: i18n.t(`survey-schemes.prompts.submit-prompt.review.${value}`),
      value,
    }));

    return { options };
  },
});
</script>

<style lang="scss" scoped></style>
