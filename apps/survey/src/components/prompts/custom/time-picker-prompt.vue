<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2 time-picker-prompt">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-time-picker
          :format="prompt.format"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
          v-bind="state"
        ></v-time-picker>
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
import { computed, defineComponent } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TimePickerPrompt',

  mixins: [createBasePrompt<'time-picker-prompt'>()],

  props: {
    value: {
      type: String as PropType<string | null>,
      default: null,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { i18n } = useI18n();

    const confirm = () => {
      if (isValid.value) return true;

      errors.value = [i18n.t(`prompts.${type}.validation.required`).toString()];
      return false;
    };

    const { action, clearErrors, errors, hasErrors, type } = usePromptUtils(props, ctx, confirm);

    const isValid = computed(() => !props.prompt.validation.required || !!state.value);
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        clearErrors();
        ctx.emit('input', value);
      },
    });

    return {
      action,
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
