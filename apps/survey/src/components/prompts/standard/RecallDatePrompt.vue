<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-date-picker
        v-model="state"
        full-width
        :landscape="!isMobile"
        v-bind="datePickerProps"
      />
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { useDatePicker } from '../partials';

export default defineComponent({
  name: 'RecallDaterPrompt',

  mixins: [createBasePrompt<'recall-date-prompt'>()],

  props: {
    value: {
      type: String as PropType<string | null>,
      default: null,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, customPromptLayout } = usePromptUtils(props, ctx);
    const { datePickerProps, isValid, state } = useDatePicker(props, ctx);

    return {
      action,
      customPromptLayout,
      datePickerProps,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
