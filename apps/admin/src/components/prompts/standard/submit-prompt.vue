<template>
  <v-tab-item key="options" value="options">
    <v-card-title>"Final Review Options"</v-card-title>
    <v-card-subtitle> "Choose the option you want for the final review page." </v-card-subtitle>
    <v-card-text>
      <v-combobox
        hide-details="auto"
        :items="options"
        :label="`Desktop Options`"
        outlined
        persistent-hint
        :value="option"
        @change="updateDesktopOptions"
      ></v-combobox>
    </v-card-text>
    <!-- <v-select :value="desktopReview" @input="update('desktopReview', $event)"> </v-select> -->
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
    desktopReview: {
      type: [Boolean, String] as PropType<Prompts['submit-prompt']['desktopReview']>,
      required: true,
    },
    mobileReview: {
      type: [Boolean, String] as PropType<Prompts['submit-prompt']['mobileReview']>,
      required: true,
    },
  },

  data() {
    return {
      options: ['Closed', 'ScrollBar', 'CheckBox'],
    };
  },

  methods: {
    updateDesktopOptions(value: string | boolean) {
      this.update('desktopReview', !value || typeof value === 'string' ? value : value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
