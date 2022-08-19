<template>
  <prompt-layout v-bind="{ description, text }">
    <template v-slot:actions>
      <v-btn
        v-if="canShowFeedback"
        class="px-5"
        color="success"
        large
        :to="{ name: 'feedback-home', params: { surveyId } }"
      >
        <v-icon left>fas fa-comments</v-icon>
        {{ $t('recall.feedback') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="canRestart" class="px-5" color="success" large @click="restart">
        <v-icon left>fas fa-tachometer-alt</v-icon>
        {{ $t('recall.restart') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { finalPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'FinalPrompt',

  mixins: [BasePrompt],

  props: {
    canRestart: {
      type: Boolean,
      default: false,
    },
    canShowFeedback: {
      type: Boolean,
      default: false,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return { ...merge(finalPromptProps, this.promptProps) };
  },

  methods: {
    restart() {
      this.$emit('restart');
    },
  },
});
</script>

<style lang="scss" scoped></style>
