<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { InfoPromptProps } from '@intake24/common/prompts';
import { infoPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<InfoPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(infoPromptProps, this.promptProps),
      currentValue: null,
    };
  },

  methods: {
    submit() {
      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
