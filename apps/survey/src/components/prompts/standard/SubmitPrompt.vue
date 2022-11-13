<template>
  <prompt-layout v-bind="{ description, text, isValid }" @nav-action="navAction">
    <template #actions>
      <submit @click.native="navAction('next')"></submit>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import { submitPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  components: { Submit },

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return { ...merge(submitPromptProps, this.promptProps) };
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
