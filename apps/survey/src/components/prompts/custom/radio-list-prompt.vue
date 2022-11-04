<template>
  <prompt-layout v-bind="{ description, text, meal }">
    <v-form ref="form" @submit.prevent="confirm">
      <v-radio-group
        v-model="selected"
        :column="orientation === 'column'"
        :error="hasErrors"
        hide-details="auto"
        :label="getLocaleContent(label)"
        :row="orientation === 'row'"
        @change="update"
      >
        <v-radio
          v-for="option in localeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        ></v-radio>
        <v-row v-if="other" align="center" no-gutters>
          <v-radio hide-details value="other"></v-radio>
          <v-text-field
            v-model.trim="otherValue"
            :error="hasErrors"
            :label="$t('prompts.radio.other')"
            @focus="selected = 'other'"
            @input="update"
          ></v-text-field>
        </v-row>
      </v-radio-group>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
    <template #actions>
      <continue @click.native="confirm"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, RadioListPromptProps } from '@intake24/common/prompts';
import { radioListPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'RadioListPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<RadioListPromptProps>,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(radioListPromptProps, this.promptProps),
      errors: [] as string[],
      otherValue: '',
      selected: this.value,
    };
  },

  computed: {
    localeOptions(): ListOption[] {
      return this.options[this.$i18n.locale] ?? this.options.en;
    },
    currentValue(): string {
      return this.selected !== 'other' ? this.selected : this.otherValue;
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    update() {
      this.clearErrors();

      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      if (!this.isValid) {
        this.errors = [
          this.getLocaleContent(this.validation.message, {
            path: 'prompts.radio.validation.required',
          }),
        ];
        return;
      }

      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped></style>
