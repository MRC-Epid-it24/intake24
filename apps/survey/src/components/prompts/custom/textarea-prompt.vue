<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-textarea
          hide-details="auto"
          :hint="translate(prompt.i18n.hint)"
          :label="translate(prompt.i18n.label)"
          outlined
          :rules="rules"
          :value="value"
          @input="update"
        ></v-textarea>
      </v-form>
    </v-card-text>
  </card-layout>
</template>

<script lang="ts">
import type { VForm } from 'vuetify/lib';
import { defineComponent, ref } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

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

  emits: ['input'],

  setup(props) {
    const form = ref<InstanceType<typeof VForm>>();

    const { i18n, translate } = useI18n();
    const { type } = usePromptUtils(props);

    const rules = ref(
      props.prompt.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (translate(props.prompt.validation.message) ??
                i18n.t(`prompts.${type.value}.validation.required`)),
          ]
        : []
    );

    return { form, translate, rules };
  },

  computed: {
    isValid(): boolean {
      return !this.prompt.validation.required || !!this.value;
    },
  },

  methods: {
    update(value: string) {
      this.$emit('input', value);
    },

    confirm() {
      //@ts-expect-error - not typed vuetify component
      const isValid = this.form?.validate();
      return isValid;
    },
  },
});
</script>

<style lang="scss" scoped></style>
