<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-radio-group
          v-model="selected"
          hide-details="auto"
          :inline="prompt.orientation === 'row'"
          :label="$t(`prompts.${type}.label`)"
          @update:model-value="update"
        >
          <v-radio
            v-for="option in localeOptions"
            :key="option.value"
            class="my-1 selection-control__start"
            :label="option.label"
            :value="option.value"
          />
          <div v-if="prompt.other" class="d-flex flex-row align-center my-1">
            <v-radio class="flex-grow-0" hide-details value="other" />
            <v-text-field
              v-model.trim="otherValue"
              hide-details="auto"
              :label="$t(`prompts.${type}.other`)"
              @change="update"
              @focus="selected = 'other'"
            />
          </div>
        </v-radio-group>
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
import { computed, defineComponent, ref } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'RadioListPrompt',

  mixins: [createBasePrompt<'radio-list-prompt'>()],

  props: {
    modelValue: {
      type: String,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: { locale } } = useI18n();

    const otherValue = ref('');
    const selected = ref(props.modelValue);

    const state = computed(() =>
      selected.value === 'other' ? `Other: ${otherValue.value}` : selected.value,
    );
    const isValid = computed(
      () =>
        !props.prompt.validation.required
        || (!!state.value && (selected.value !== 'other' || !!otherValue.value)),
    );
    const localeOptions = computed(
      () => props.prompt.options[locale.value] ?? props.prompt.options.en,
    );

    const { action, customPromptLayout, type } = usePromptUtils(props, ctx);

    const update = () => {
      ctx.emit('update:modelValue', state.value);
    };

    return {
      action,
      customPromptLayout,
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

<style lang="scss">
.selection-control__start {
  .v-selection-control__wrapper {
    align-self: flex-start;
  }
}
</style>
