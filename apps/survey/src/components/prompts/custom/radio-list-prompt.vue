<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-radio-group
        v-model="selected"
        :column="prompt.orientation === 'column'"
        :error="hasErrors"
        hide-details="auto"
        :label="getLocaleContent(prompt.i18n.label)"
        :row="prompt.orientation === 'row'"
        @change="update"
      >
        <v-radio
          v-for="option in localeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        ></v-radio>
        <v-row v-if="prompt.other" align="center" no-gutters>
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

import type { ListOption } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'RadioListPrompt',

  mixins: [createBasePrompt<'radio-list-prompt'>()],

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
      return this.prompt.options[this.$i18n.locale] ?? this.prompt.options.en;
    },
    currentValue(): string {
      return this.selected !== 'other' ? this.selected : this.otherValue;
    },
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.currentValue;
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
        this.getLocaleContent(this.prompt.validation.message, {
          path: 'prompts.radio.validation.required',
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
