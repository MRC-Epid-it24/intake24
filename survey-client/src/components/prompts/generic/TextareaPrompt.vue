<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-textarea
          v-model="currentValue"
          :hint="getLocaleContent(hint)"
          :label="getLocaleContent(label)"
          :rules="rules"
          hide-details="auto"
          outlined
        ></v-textarea>
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { TextareaPromptProps, textareaPromptProps } from '@common/prompts';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'TextareaPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => TextareaPromptProps,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    const props: TextareaPromptProps = merge(textareaPromptProps, this.props);

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
    onSubmit() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
