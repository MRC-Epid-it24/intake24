<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <v-btn
        :block="isMobile"
        :title="$t('common.action.no')"
        class="px-10 ml-0"
        color="error"
        x-large
        @click.stop="answer(false)"
      >
        <v-icon left>far fa-times-circle</v-icon>
        {{ $t('common.action.no') }}
      </v-btn>
      <v-btn
        :block="isMobile"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        :title="$t('common.action.yes')"
        class="px-10"
        color="success"
        x-large
        @click.stop="answer(true)"
      >
        <v-icon left>far fa-circle-check</v-icon>
        {{ $t('common.action.yes') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { YesNoPromptProps } from '@intake24/common/prompts';
import { yesNoPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'YesNoPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<YesNoPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(yesNoPromptProps, this.promptProps),
    };
  },

  methods: {
    answer(value: boolean) {
      this.$emit('answer', value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
