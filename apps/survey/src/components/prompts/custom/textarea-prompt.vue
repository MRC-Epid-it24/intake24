<template>
  <prompt-layout v-bind="{ actions, description, text, meal, food, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-textarea
        v-model.trim="currentValue"
        hide-details="auto"
        :hint="getLocaleContent(hint)"
        :label="getLocaleContent(label)"
        outlined
        :rules="rules"
        @input="update"
      ></v-textarea>
    </v-form>
  </prompt-layout>
</template>

<script lang="ts">
import type { VForm } from 'vuetify/lib';
import { defineComponent, ref } from 'vue';

import type { TextareaPromptProps } from '@intake24/common/prompts';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TextareaPrompt',

  mixins: [createBasePrompt<TextareaPromptProps>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  setup() {
    const form = ref<InstanceType<typeof VForm>>();

    return { form };
  },

  data() {
    return {
      currentValue: this.value,
      rules: this.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (this.getLocaleContent(this.validation.message) ??
                this.$t('prompts.textarea.validation.required')),
          ]
        : [],
    };
  },

  computed: {
    isValid(): boolean {
      return !this.validation.required || !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      const isValid = this.form?.validate();
      return isValid;
    },
  },
});
</script>

<style lang="scss" scoped></style>
