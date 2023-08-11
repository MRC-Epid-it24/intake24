<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-radio-group
          v-model="selected"
          :column="prompt.orientation === 'column'"
          :error="hasErrors"
          hide-details="auto"
          :label="translate(prompt.i18n.label)"
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
            <v-radio class="my-auto" hide-details value="other"></v-radio>
            <v-text-field
              v-model.trim="otherValue"
              :error="hasErrors"
              hide-details="auto"
              :label="$t(`prompts.${type}.other`)"
              outlined
              @focus="selected = 'other'"
              @input="update"
            ></v-text-field>
          </v-row>
        </v-radio-group>
        <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
      </v-form>
    </v-card-text>
  </card-layout>
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

  emits: ['input'],

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
      return this.selected === 'other' ? `Other: ${this.otherValue}` : this.selected;
    },
    isValid(): boolean {
      return (
        !this.prompt.validation.required ||
        (!!this.currentValue && (this.selected !== 'other' || !!this.otherValue))
      );
    },
  },

  methods: {
    update() {
      this.clearErrors();

      this.$emit('input', this.currentValue);
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
