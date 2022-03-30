<template>
  <prompt-layout :text="text" :description="description">
    <template v-slot:actions>
      <p>Review and Confirm Prompt</p>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import { BasePromptProps } from '@intake24/common/prompts';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      if (text) return text;
      return '';
    },

    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      if (description) return description;
      return '';
    },
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
