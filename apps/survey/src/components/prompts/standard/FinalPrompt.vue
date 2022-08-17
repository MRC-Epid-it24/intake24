<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <v-btn class="px-5" color="success" large @click="restart">New recall</v-btn>
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
    promptProps: {
      type: Object as PropType<BasePromptProps>,
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
