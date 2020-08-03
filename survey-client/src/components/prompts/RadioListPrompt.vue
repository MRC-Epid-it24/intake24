<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-radio-group
          v-model="selected"
          :error="hasErrors"
          :label="label[$i18n.locale]"
          hide-details="auto"
          :column="orientation === 'column'"
          :row="orientation === 'row'"
          @change="clearErrors"
        >
          <v-radio
            v-for="option in options[$i18n.locale]"
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
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { PromptRefs } from '@common/types/prompts';
import { RadioListPromptProps } from '@common/types/promptProps';
import { radioListPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt from './BasePrompt';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
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
          this.validation.message[this.$i18n.locale] ??
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
