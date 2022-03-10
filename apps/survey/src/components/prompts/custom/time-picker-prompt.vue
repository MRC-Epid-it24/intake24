<template>
  <prompt-layout :text="text" :description="description">
    <v-form ref="form" @submit.prevent="submit">
      <v-time-picker
        v-model="currentValue"
        :format="format"
        :landscape="!isMobile"
        full-width
        @input="clearErrors"
      ></v-time-picker>
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
    </v-form>
    <template v-slot:actions>
      <continue @click.native="submit"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import { TimePickerPromptProps, timePickerPromptProps } from '@intake24/common/prompts';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'TimePickerPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<TimePickerPromptProps>,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      ...merge(timePickerPromptProps, this.promptProps),
      currentValue: this.value,
      errors: [] as string[],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    submit() {
      if (this.validation.required && !this.currentValue) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            this.$t('prompts.timepicker.validation.required').toString(),
        ];
        return;
      }

      this.$emit('answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
