<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-label v-if="$t(`prompts.${type}.label`)">{{ $t(`prompts.${type}.label`) }}</v-label>
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
import { computed, defineComponent, ref, watch } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

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

  setup(props, ctx) {
    const { i18n } = useI18n();

    const otherEnabled = ref(false);
    const otherValue = ref('');
    const selected = ref(Array.isArray(props.value) ? props.value : []);

    const state = computed(() =>
      [...selected.value, otherValue.value.length ? `Other: ${otherValue.value}` : ''].filter(
        Boolean
      )
    );
    const isValid = computed(() => !props.prompt.validation.required || !!state.value.length);
    const localeOptions = computed(
      () => props.prompt.options[i18n.locale] ?? props.prompt.options.en
    );

    const confirm = () => {
      if (isValid.value) return true;

      errors.value = [i18n.t(`prompts.${type.value}.validation.required`).toString()];
      return false;
    };

    const { action, clearErrors, errors, hasErrors, type } = usePromptUtils(props, ctx, confirm);

    const update = () => {
      clearErrors();

      ctx.emit('input', [...state.value]);
    };

    watch(otherEnabled, (val) => {
      if (!val) otherValue.value = '';

      update();
    });

    return {
      action,
      errors,
      hasErrors,
      isValid,
      localeOptions,
      otherEnabled,
      otherValue,
      selected,
      type,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
