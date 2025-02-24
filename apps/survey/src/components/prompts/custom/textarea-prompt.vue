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
          :rules="rules"
        />
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { useForm } from '../partials';

export default defineComponent({
  name: 'TextareaPrompt',

  mixins: [createBasePrompt<'textarea-prompt'>()],

  props: {
    modelValue: {
      type: String,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: { t }, translate } = useI18n();
    const { form, inputTooLog } = useForm();

    const isValid = computed(() => !!form.value?.isValid && (!props.prompt.validation.required || !!props.modelValue));
    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    const { action, customPromptLayout, type } = usePromptUtils(props, ctx);

    const rules = computed(() => {
      const items = [inputTooLog(512)];

      if (props.prompt.validation.required) {
        items.push((v: string | null) =>
          !!v
          || (translate(props.prompt.validation.message)
            ?? t(`prompts.${type.value}.validation.required`)));
      }

      return items;
    });

    return {
      action,
      customPromptLayout,
      form,
      isValid,
      rules,
      state,
      translate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
