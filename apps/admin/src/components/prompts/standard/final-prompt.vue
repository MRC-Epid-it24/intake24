<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-card-title>
          <v-icon left>fas fa-star-half-stroke</v-icon>
          {{ $t('survey-schemes.prompts.final-prompt.rating.title') }}
        </v-card-title>
        <v-card-text>
          <v-switch
            hide-details="auto"
            :input-value="rating"
            :label="$t('survey-schemes.prompts.final-prompt.rating._')"
            @change="update('rating', $event)"
          ></v-switch>
        </v-card-text>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'FinalPrompt',

  mixins: [basePrompt],

  props: {
    rating: {
      type: Boolean as PropType<Prompts['final-prompt']['rating']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
