<template>
  <prompt-layout v-bind="{ description, text, meal, food, isValid }" @nav-action="navAction">
    <v-form ref="form" @submit.prevent="navAction('next')">
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
    <template #actions>
      <continue @click.native="navAction('next')"></continue>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VForm } from 'vuetify/lib';
import { defineComponent, ref } from 'vue';

import type { TextareaPromptProps } from '@intake24/common/prompts';
import { textareaPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'TextareaPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<TextareaPromptProps>,
      required: true,
    },
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
    const props: TextareaPromptProps = merge(textareaPromptProps, this.promptProps);

    return {
      ...props,
      currentValue: this.value,
      rules: props.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (this.getLocaleContent(props.validation.message) ??
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
