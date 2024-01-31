<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text>
      <v-form ref="form" @submit.prevent="action('next')">
        <v-row>
          <v-col cols="12" md="auto">
            <v-select
              v-model="state"
              hide-details="auto"
              item-text="label"
              item-value="value"
              :items="localeOptions"
              :label="promptI18n.label"
              :multiple="prompt.multiple"
              outlined
            ></v-select>
          </v-col>
        </v-row>
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
import { computed, defineComponent } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SelectPrompt',

  mixins: [createBasePrompt<'select-prompt'>()],

  props: {
    value: {
      type: [String, Number, Array] as PropType<string | number | string[] | number[]>,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { i18n, translate } = useI18n();
    const { action, type } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    const promptI18n = computed(() => ({
      label: i18n.t(`prompts.${type.value}.label`),
    }));

    const isValid = computed(() => {
      if (!props.prompt.validation.required) return true;

      if (props.prompt.multiple && Array.isArray(state.value)) return !!state.value.length;

      return typeof state.value !== 'undefined' && state.value !== null;
    });
    const localeOptions = computed(
      () => props.prompt.options[i18n.locale] ?? props.prompt.options.en
    );

    return { action, isValid, localeOptions, promptI18n, state, translate };
  },
});
</script>

<style lang="scss"></style>
