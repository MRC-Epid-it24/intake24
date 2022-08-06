<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <submit @click.native="submit"></submit>
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

  mixins: [BasePrompt],

  components: { submit: Submit },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return { ...merge(submitPromptProps, this.promptProps) };
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
