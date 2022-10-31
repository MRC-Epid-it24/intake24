<template>
  <prompt-layout v-bind="{ description, text, meal }">
    <template #actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { NoMoreInformationPromptProps } from '@intake24/common/prompts';
import { noMoreInformationPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'NoMoreInformationPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<NoMoreInformationPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(noMoreInformationPromptProps, this.promptProps),
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
