<template>
  <prompt-layout :text="text" :description="description">
    <v-form ref="form" @submit.prevent="submit">
      <v-label>{{ getLocaleContent(label) }}</v-label>
      <v-checkbox
        v-model="selected"
        v-for="option in getLocaleContent(options)"
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
          v-model.trim="otherValue"
          :error="hasErrors && otherEnabled"
          :disabled="!otherEnabled"
          :label="$t('prompts.checkbox.other')"
          @input="clearErrors"
        ></v-text-field>
      </v-row>
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
    </v-form>
    <template v-slot:actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CheckboxListPromptProps } from '@intake24/common/prompts';
import { checkboxListPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'CheckboxListPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<CheckboxListPromptProps>,
      required: true,
    },
    value: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
  },

  data() {
    return {
      ...merge(checkboxListPromptProps, this.promptProps),
      errors: [] as string[],
      otherEnabled: false,
      otherValue: '',
      selected: Array.isArray(this.value) ? this.value : [],
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

    submit() {
      if (this.validation.required && !this.currentValue.length) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            this.$t('prompts.checkbox.validation.required').toString(),
        ];
        return;
      }

      this.$emit('answer', [...this.currentValue]);
    },
  },
});
</script>

<style lang="scss" scoped></style>
