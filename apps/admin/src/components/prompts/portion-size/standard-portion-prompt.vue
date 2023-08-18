<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :input-value="badges"
          :label="$t('survey-schemes.prompts.badges')"
          @change="update('badges', $event)"
        >
        </v-switch>
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
  name: 'StandardPortionPrompt',

  mixins: [basePrompt],

  props: {
    badges: {
      type: Boolean as PropType<Prompts['standard-portion-prompt']['badges']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
