<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-radio-group
          v-model="selected"
          :column="prompt.orientation === 'column'"
          :error="hasErrors"
          hide-details="auto"
          :label="$t(`prompts.${type}.label`)"
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
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

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

  setup(props, ctx) {
    const { i18n } = useI18n();

    const otherValue = ref('');
    const selected = ref(props.value);

    const state = computed(() =>
      selected.value === 'other' ? `Other: ${otherValue.value}` : selected.value
    );
    const isValid = computed(
      () =>
        !props.prompt.validation.required ||
        (!!state.value && (selected.value !== 'other' || !!otherValue.value))
    );
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

      ctx.emit('input', state.value);
    };

    return {
      action,
      errors,
      hasErrors,
      isValid,
      localeOptions,
      otherValue,
      selected,
      type,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
