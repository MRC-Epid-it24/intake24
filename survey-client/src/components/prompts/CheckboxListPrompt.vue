<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-label>{{ label }}</v-label>
        <v-checkbox
          v-model="selected"
          v-for="option in options"
          :key="option.value"
          :error="hasErrors"
          :label="option.label"
          :value="option.value"
          class="mt-2"
          hide-details="auto"
          @change="clearErrors"
        ></v-checkbox>
        <v-row v-if="other" align="center" no-gutters>
          <v-checkbox v-model="otherEnabled" hide-details class="mt-0 pb-2"></v-checkbox>
          <v-text-field
            v-model="otherValue"
            :error="hasErrors && otherEnabled"
            :disabled="!otherEnabled"
            label="Please specify"
            @input="clearErrors"
          ></v-text-field>
        </v-row>
        <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import merge from 'deepmerge';
import { ChechboxListProps, PromptRefs } from '@/types/prompts';
import BasePrompt from './BasePrompt';
import { checkboxListDefaults } from './promptDefaults';

export default (Vue as VueConstructor<Vue & PromptRefs>).extend({
  name: 'CheckboxListPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<ChechboxListProps>,
    },
    value: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
  },

  data() {
    return {
      ...merge(checkboxListDefaults, this.props),
      errors: [] as string[],
      otherEnabled: false,
      otherValue: '',
      selected: this.value,
    };
  },

  computed: {
    currentValue(): string[] {
      return [...this.selected, this.otherValue].filter((item) => item);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  watch: {
    other(val) {
      if (!val) this.otherValue = '';
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    onSubmit() {
      if (this.validation.required && !this.currentValue.length) {
        this.errors = [this.validation.message];
        return;
      }

      this.$emit('answer', [...this.currentValue]);
    },
  },
});
</script>

<style lang="scss" scoped></style>
