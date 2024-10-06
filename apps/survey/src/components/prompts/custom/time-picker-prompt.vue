<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2 time-picker-prompt">
      <v-form @submit.prevent="action('next')">
        <v-time-picker
          v-model="state"
          :format="prompt.format"
          full-width
          :landscape="$vuetify.display.smAndUp"
          title=""
        />
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
import { computed, defineComponent } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TimePickerPrompt',

  mixins: [createBasePrompt<'time-picker-prompt'>()],

  props: {
    modelValue: {
      type: String as PropType<string | null>,
      default: null,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: { t } } = useI18n();

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        clearErrors();
        ctx.emit('update:modelValue', value);
      },
    });

    const isValid = computed(() => !props.prompt.validation.required || !!state.value);

    const confirm = () => {
      if (isValid.value)
        return true;

      errors.value = [t(`prompts.${type}.validation.required`)];
      return false;
    };

    const { action, clearErrors, customPromptLayout, errors, hasErrors, type } = usePromptUtils(
      props,
      ctx,
      confirm,
    );

    return {
      action,
      customPromptLayout,
      errors,
      hasErrors,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped>
.time-picker-prompt {
  .v-time-picker-title {
    justify-content: center;
  }
}
</style>
