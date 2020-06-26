<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-radio-group
          v-model="selected"
          :error="hasErrors"
          :label="label"
          hide-details="auto"
          :column="orientation === 'column'"
          :row="orientation === 'row'"
          @change="clearErrors"
        >
          <v-radio
            v-for="option in options"
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
import Vue, { PropType, VueConstructor } from 'vue';
import merge from 'deepmerge';
import { RadioListProps, PromptRefs } from '@/types/prompts';
import BasePrompt from './BasePrompt';
import { radioListDefaults } from './promptDefaults';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
  name: 'RadioListPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<RadioListProps>,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(radioListDefaults, this.props),
      errors: [] as string[],
      otherEnabled: false,
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
        this.errors = [this.validation.message];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
