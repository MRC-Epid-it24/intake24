<template>
  <prompt-layout :text="text" :description="description">
    <v-form ref="form" @submit.prevent="submit">
      <v-textarea
        v-model.trim="currentValue"
        :hint="getLocaleContent(hint)"
        :label="getLocaleContent(label)"
        :rules="rules"
        hide-details="auto"
        outlined
      ></v-textarea>
    </v-form>
    <template v-slot:actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import { TextareaPromptProps, textareaPromptProps } from '@intake24/common/prompts';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'TextareaPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<TextareaPromptProps>,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    const props: TextareaPromptProps = merge(textareaPromptProps, this.promptProps);

    return {
      ...props,
      currentValue: this.value,
      rules: props.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (this.getLocaleContent(props.validation.message) ??
                this.$t('prompts.textarea.validation.required')),
          ]
        : [],
    };
  },

  methods: {
    submit() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
