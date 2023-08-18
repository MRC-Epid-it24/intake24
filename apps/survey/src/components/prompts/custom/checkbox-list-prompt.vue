<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-label v-if="prompt.i18n.label">{{ translate(prompt.i18n.label) }}</v-label>
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
          <v-checkbox v-model="otherEnabled" class="my-auto" hide-details></v-checkbox>
          <v-text-field
            v-model.trim="otherValue"
            :disabled="!otherEnabled"
            :error="hasErrors && otherEnabled"
            hide-details="auto"
            :label="$t(`prompts.${type}.other`)"
            outlined
            @input="update"
          ></v-text-field>
        </v-row>
        <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </card-layout>
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

  emits: ['input'],

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
      return [...this.selected, this.otherValue.length ? `Other: ${this.otherValue}` : ''].filter(
        Boolean
      );
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

      this.$emit('input', [...this.currentValue]);
    },

    confirm() {
      if (this.isValid) return true;

      this.errors = [
        this.translate(this.prompt.validation.message, {
          path: `prompts.${this.type}.validation.required`,
        }),
      ];
      return false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
