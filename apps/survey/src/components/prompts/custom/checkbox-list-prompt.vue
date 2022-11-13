<template>
  <prompt-layout v-bind="{ description, text, meal, food, isValid }" @nav-action="navAction">
    <v-form @submit.prevent="navAction('next')">
      <v-label v-if="label">{{ getLocaleContent(label) }}</v-label>
      <v-checkbox
        v-for="option in localeOptions"
        :key="option.value"
        v-model="selected"
        class="mt-2"
        :error="hasErrors"
        hide-details="auto"
        :label="option.label"
        :value="option.value"
        @change="update"
      ></v-checkbox>
      <v-row v-if="other" align="center" no-gutters>
        <v-checkbox v-model="otherEnabled" class="mt-0 pb-2" hide-details></v-checkbox>
        <v-text-field
          v-model.trim="otherValue"
          :disabled="!otherEnabled"
          :error="hasErrors && otherEnabled"
          :label="$t('prompts.checkbox.other')"
          @input="update"
        ></v-text-field>
      </v-row>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
    <template #actions>
      <continue @click.native="navAction('next')"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CheckboxListPromptProps, ListOption } from '@intake24/common/prompts';
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
      otherEnabled: false,
      otherValue: '',
      selected: Array.isArray(this.value) ? this.value : [],
    };
  },

  computed: {
    localeOptions(): ListOption[] {
      return this.options[this.$i18n.locale] ?? this.options.en;
    },
    currentValue(): string[] {
      return [...this.selected, this.otherValue].filter((item) => item);
    },
    isValid(): boolean {
      return !this.validation.required || !!this.currentValue.length;
    },
  },

  watch: {
    other(val) {
      if (!val) this.otherValue = '';
    },
  },

  methods: {
    update() {
      this.clearErrors();

      this.$emit('update', { state: [...this.currentValue], valid: this.isValid });
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.getLocaleContent(this.validation.message, {
          path: 'prompts.checkbox.validation.required',
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
