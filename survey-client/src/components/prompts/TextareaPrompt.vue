<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-textarea
          v-model="currentValue"
          :hint="hint"
          :label="label"
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
import Vue, { PropType, VueConstructor } from 'vue';
import merge from 'deepmerge';
import { TextareaProps, PromptRefs } from '@/types/prompts';
import BasePrompt from './BasePrompt';
import { textareaDefaults } from './promptDefaults';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
  name: 'TextareaPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<TextareaProps>,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    const props: TextareaProps = merge(textareaDefaults, this.props);

    return {
      ...props,
      currentValue: this.value,
      rules: props.validation.required
        ? [(v: string | null) => !!v || props.validation.message]
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
