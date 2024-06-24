<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-label v-if="$t(`prompts.${type}.label`)">
          {{ $t(`prompts.${type}.label`) }}
        </v-label>
        <v-checkbox
          v-for="option in localeOptions"
          :key="option.value"
          v-model="selected"
          class="mt-2"
          :disabled="disableOption(option.value)"
          :error="hasErrors"
          hide-details="auto"
          :label="option.label"
          :value="option.value"
          @change="update(option)"
        />
        <v-row v-if="prompt.other" align="center" class="mt-2" no-gutters>
          <v-checkbox v-model="otherEnabled" class="my-auto" :disabled="disableOption(otherOutput)" hide-details />
          <v-text-field
            v-model.trim="otherValue"
            :disabled="!otherEnabled || disableOption(otherOutput)"
            :error="hasErrors && otherEnabled"
            hide-details="auto"
            :label="$t(`prompts.${type}.other`)"
            outlined
            @input="update"
          />
        </v-row>
        <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error" />
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
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

import type { ListOption } from '@intake24/common/types';
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
    const otherOutput = computed(() => otherValue.value.length ? `Other: ${otherValue.value}` : '');

    const selected = ref(Array.isArray(props.value) ? props.value : []);
    const state = computed(() => [...selected.value, otherOutput.value].filter(Boolean));

    const localeOptions = computed(
      () => props.prompt.options[i18n.locale] ?? props.prompt.options.en,
    );
    const isExclusiveSelected = computed(() => !!localeOptions.value.find(option => option.exclusive && props.value.includes(option.value)));
    const isMinSatisfied = computed(() => !props.prompt.validation.min || props.value.length >= props.prompt.validation.min);
    const isMaxSatisfied = computed(() => !props.prompt.validation.max || props.value.length <= props.prompt.validation.max);
    const isRequiredSatisfied = computed(() => !props.prompt.validation.required || !!props.value.length);
    const isValid = computed(() => isRequiredSatisfied.value && (isExclusiveSelected.value || (isMinSatisfied.value && isMaxSatisfied.value)));

    const disableOption = (value: string) => !props.value.includes(value)
      && (isExclusiveSelected.value || (!!props.prompt.validation.max && props.value.length === props.prompt.validation.max));

    const confirm = () => {
      if (isValid.value)
        return true;

      errors.value = [i18n.t(`prompts.${type.value}.validation.required`).toString()];
      return false;
    };

    const { action, clearErrors, customPromptLayout, errors, hasErrors, type } = usePromptUtils(
      props,
      ctx,
      confirm,
    );

    const update = (option?: ListOption) => {
      if (option?.exclusive && selected.value.includes(option.value)) {
        selected.value = [option.value];
        otherEnabled.value = false;
      }

      clearErrors();

      ctx.emit('input', [...state.value]);
    };

    watch(otherEnabled, (val) => {
      if (!val)
        otherValue.value = '';

      update();
    });

    return {
      action,
      customPromptLayout,
      errors,
      hasErrors,
      isValid,
      localeOptions,
      disableOption,
      otherEnabled,
      otherOutput,
      otherValue,
      selected,
      type,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
