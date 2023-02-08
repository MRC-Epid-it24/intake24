<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-form @submit.prevent="action('next')">
      <v-label v-if="prompt.i18n.label">{{ getLocaleContent(prompt.i18n.label) }}</v-label>
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
      <v-row v-if="prompt.other" align="center" class="mt-2" no-gutters>
        <v-checkbox v-model="otherEnabled" class="mb-auto" hide-details></v-checkbox>
        <v-text-field
          v-model.trim="otherValue"
          :disabled="!otherEnabled"
          :error="hasErrors && otherEnabled"
          hide-details="auto"
          :label="$t('prompts.checkbox.other')"
          outlined
          @input="update"
        ></v-text-field>
      </v-row>
      <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
    </v-form>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'CheckboxListPrompt',

  mixins: [createBasePrompt<'checkbox-list-prompt'>()],

  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
  },

  emits: ['update'],

  data() {
    return {
      otherEnabled: false,
      otherValue: '',
      selected: Array.isArray(this.value) ? this.value : [],
    };
  },

  computed: {
    localeOptions(): ListOption[] {
      return this.prompt.options[this.$i18n.locale] ?? this.prompt.options.en;
    },
    currentValue(): string[] {
      return [...this.selected, this.otherValue].filter((item) => item);
    },
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.currentValue.length;
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

      this.$emit('update', { state: [...this.currentValue] });
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.getLocaleContent(this.prompt.validation.message, {
          path: 'prompts.checkbox.validation.required',
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
