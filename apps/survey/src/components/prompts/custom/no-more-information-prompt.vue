<template>
  <prompt-layout
    v-bind="{ actions, description: localeDescription, text: localeText, meal, food, isValid }"
    @action="action"
  >
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { NoMoreInformationPromptProps } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'NoMoreInformationPrompt',

  mixins: [createBasePrompt<NoMoreInformationPromptProps>()],

  data() {
    return {
      currentValue: 'ok',
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
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
