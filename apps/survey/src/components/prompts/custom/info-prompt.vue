<template>
  <prompt-layout v-bind="{ description, text, meal, food }">
    <template #actions>
      <continue @click.native="confirm"></continue>
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

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      this.update();
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped></style>
