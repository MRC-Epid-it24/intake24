<template>
  <prompt-layout v-bind="{ description: localeDescription, text: localeText, meal }">
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

  computed: {
    localeText(): string {
      return this.getLocaleContent(this.text, {
        path: `prompts.noMoreInfo.${this.isMeal ? 'meal' : 'food'}.text`,
        params: { item: this.foodOrMealName },
      });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.description, {
        path: `prompts.noMoreInfo.${this.isMeal ? 'meal' : 'food'}.description`,
        params: { item: this.foodOrMealName },
      });
    },
  },

  methods: {
    submit() {
      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
