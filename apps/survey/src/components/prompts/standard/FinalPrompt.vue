<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <template #actions>
      <v-btn class="px-4" color="success" large :to="{ name: 'survey-home', params: { surveyId } }">
        <v-icon left>$home</v-icon>
        {{ $t('common.home') }}
      </v-btn>
      <v-btn
        v-if="canShowFeedback"
        class="px-4"
        color="success"
        large
        :to="{ name: 'feedback-home', params: { surveyId } }"
      >
        <v-icon left>$feedback</v-icon>
        {{ $t('recall.actions.feedback') }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
        <span>{{ $t('common.home') }}</span>
        <v-icon>$home</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn v-if="canShowFeedback" :to="{ name: 'feedback-home', params: { surveyId } }">
        <span>{{ $t('recall.actions.nav.feedback') }}</span>
        <v-icon>$feedback</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FinalPrompt',

  mixins: [createBasePrompt<'final-prompt'>()],

  props: {
    canRestart: {
      type: Boolean,
      default: false,
    },
    canShowFeedback: {
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
