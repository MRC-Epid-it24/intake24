<template>
  <v-tab-item key="options" value="options">
    <v-card-title>"Final Review Options"</v-card-title>
    <v-card-subtitle> "Choose the option you want for the final review page." </v-card-subtitle>
    <v-card-text>
      <v-combobox
        v-for="(value, key) in review"
        :key="key"
        v-model="localReview[key]"
        :items="[false, 'checkbox', 'scroll']"
        :label="key"
        @change="updateReviewOptions(key, $event)"
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
    desktopReview: {
      type: [Boolean, String] as PropType<Prompts['submit-prompt']['desktopReview']>,
      required: true,
    },
    mobileReview: {
      type: [Boolean, String] as PropType<Prompts['submit-prompt']['mobileReview']>,
      required: true,
    },
    review: {
      type: Object as PropType<Prompts['submit-prompt']['review']>,
    },
  },

  data() {
    return {
      localReview: { ...this.review },
    };
  },

  watch: {
    review: {
      handler(newVal) {
        this.localReview = { ...newVal };
      },
      immediate: true,
    },
  },

  methods: {
    updateDesktopOptions(value: string | boolean) {
      this.update('desktopReview', !value || typeof value === 'string' ? value : value);
    },

    updateReviewOptions(key: string, value: string | boolean) {
      const updatedReview = { ...this.localReview, [key]: value };
      this.update('review', updatedReview);
      console.log('review:', this.review);
    },
  },
});
</script>

<style lang="scss" scoped></style>
