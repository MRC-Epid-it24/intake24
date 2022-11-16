<template>
  <prompt-layout v-bind="{ actions, description, text, food, meal, isValid }" @action="action">
    <template #actions>
      <submit @click.native="action('next')"></submit>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  components: { Submit },

  mixins: [createBasePrompt<BasePromptProps>()],

  computed: {
    isValid(): boolean {
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
