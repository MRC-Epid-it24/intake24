<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-textarea
          v-model="state"
          hide-details="auto"
          :hint="translate(prompt.i18n.hint)"
          :label="translate(prompt.i18n.label)"
          outlined
          :rules="rules"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </component>
</template>

<script lang="ts">
import type { VForm } from 'vuetify/lib';
import { computed, defineComponent, ref } from 'vue';

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

  setup(props, ctx) {
    const { i18n, translate } = useI18n();

    const form = ref<InstanceType<typeof VForm>>();
    const isValid = computed(() => !props.prompt.validation.required || !!props.value);
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    const confirm = () => {
      //@ts-expect-error - not typed vuetify component
      const isValid = form.value?.validate();
      return isValid;
    };

    const { action, customPromptLayout, type } = usePromptUtils(props, ctx, confirm);

    const rules = computed(() =>
      props.prompt.validation.required
        ? [
            (v: string | null) =>
              !!v ||
              (translate(props.prompt.validation.message) ??
                i18n.t(`prompts.${type.value}.validation.required`)),
          ]
        : []
    );

    return { action, customPromptLayout, form, isValid, rules, state, translate };
  },
});
</script>

<style lang="scss" scoped></style>
