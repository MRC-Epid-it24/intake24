<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <v-btn
        class="px-4"
        color="secondary"
        large
        outlined
        :to="{ name: 'survey-home', params: { surveyId } }"
      >
        <v-icon left>$home</v-icon>
        {{ $t('common.home') }}
      </v-btn>
      <v-btn
        v-if="showFeedback"
        class="px-4"
        color="secondary"
        large
        outlined
        :to="{ name: 'feedback-home', params: { surveyId } }"
      >
        <v-icon left>$feedback</v-icon>
        {{ $t('recall.actions.feedback') }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
        <span class="text-overline font-weight-medium">{{ $t('common.home') }}</span>
        <v-icon class="pb-1">$home</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn v-if="showFeedback" :to="{ name: 'feedback-home', params: { surveyId } }">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.feedback') }}
        </span>
        <v-icon class="pb-1">$feedback</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FinalPrompt',

  mixins: [createBasePrompt<'final-prompt'>()],

  props: {
    showFeedback: {
      type: Boolean,
      default: false,
    },
    surveyId: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
