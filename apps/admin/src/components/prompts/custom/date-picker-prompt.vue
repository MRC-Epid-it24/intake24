<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="futureDates"
          :label="$t('survey-schemes.prompts.date-picker-prompt.futureDates')"
          @change="update('futureDates', $event)"
        />
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
  name: 'DatePickerPrompt',

  mixins: [basePrompt],

  props: {
    futureDates: {
      type: Boolean as PropType<Prompts['date-picker-prompt']['futureDates']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
