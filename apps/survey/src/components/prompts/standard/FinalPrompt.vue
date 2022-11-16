<template>
  <prompt-layout v-bind="{ actions, description, text, food, meal, isValid }" @action="action">
    <template #actions>
      <v-btn
        v-if="canShowFeedback"
        class="px-5"
        color="success"
        large
        :to="{ name: 'feedback-home', params: { surveyId } }"
      >
        <v-icon left>$feedback</v-icon>
        {{ $t('recall.feedback') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="canRestart" class="px-5" color="success" large @click="action('restart')">
        <v-icon left>$survey</v-icon>
        {{ $t('recall.restart') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FinalPromptProps } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FinalPrompt',

  mixins: [createBasePrompt<FinalPromptProps>()],

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
