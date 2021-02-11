<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-radio-group
          v-model="selected"
          :error="hasErrors"
          :label="getLocaleContent(label)"
          hide-details="auto"
          :column="orientation === 'column'"
          :row="orientation === 'row'"
          @change="clearErrors"
        >
          <v-radio
            v-for="option in getLocaleContent(options)"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></v-radio>
          <v-row v-if="other" align="center" no-gutters>
            <v-radio value="other" hide-details></v-radio>
            <v-text-field
              v-model="otherValue"
              :error="hasErrors"
              label="Please specify"
              @input="clearErrors"
              @focus="selected = 'other'"
            ></v-text-field>
          </v-row>
        </v-radio-group>
        <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { RadioListPromptProps } from '@common/types';
import { radioListPromptProps } from '@common/defaults';
import BasePrompt, { Prompt } from './BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'RadioListPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => RadioListPromptProps,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(radioListPromptProps, this.props),
      errors: [] as string[],
      otherValue: '',
      selected: this.value,
    };
  },

  computed: {
    currentValue(): string {
      return this.selected !== 'other' ? this.selected : this.otherValue;
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    onSubmit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('prompts.radio.validation.required') as string),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
