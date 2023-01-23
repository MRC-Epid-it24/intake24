<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-textarea
        v-model.trim="currentValue"
        hide-details="auto"
        :hint="getLocaleContent(prompt.i18n.hint)"
        :label="getLocaleContent(prompt.i18n.label)"
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

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TextareaPrompt',

  mixins: [createBasePrompt<'textarea-prompt'>()],

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  emits: ['update'],

  setup() {
    const form = ref<InstanceType<typeof VForm>>();

    return { form };
  },

  data() {
    return {
      currentValue: this.value,
      rules: this.prompt.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (this.getLocaleContent(this.prompt.validation.message) ??
                this.$t('prompts.textarea.validation.required')),
          ]
        : [],
    };
  },

  computed: {
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue });
    },

    confirm() {
      const isValid = this.form?.validate();
      return isValid;
    },
  },
});
</script>

<style lang="scss" scoped></style>
