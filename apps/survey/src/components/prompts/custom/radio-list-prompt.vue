<template>
  <prompt-layout v-bind="{ actions, description, text, meal, food, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
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
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ListOption, RadioListPromptProps } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'RadioListPrompt',

  mixins: [createBasePrompt<RadioListPromptProps>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
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
    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.clearErrors();

      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.getLocaleContent(this.validation.message, {
          path: 'prompts.radio.validation.required',
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
