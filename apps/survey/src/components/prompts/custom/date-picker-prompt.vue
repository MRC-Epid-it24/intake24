<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2">
      <v-date-picker
        v-model="state"
        full-width
        :landscape="!$vuetify.display.mobile"
        v-bind="datePickerProps"
        title=""
      />
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { usePromptUtils } from '@intake24/survey/composables';
import { Next, NextMobile } from '../actions';
import { BaseLayout, CardLayout, PanelLayout } from '../layouts';
import { useDatePicker } from '../partials';
import { createBasePromptProps } from '../prompt-props';

defineOptions({
  name: 'DatePickerPrompt',
  components: { BaseLayout, CardLayout, PanelLayout },
});

const props = defineProps({
  ...createBasePromptProps<'date-picker-prompt'>(),
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, customPromptLayout } = usePromptUtils(props, { emit });
const { datePickerProps, isValid, state } = useDatePicker(props, { emit });
</script>

<style lang="scss" scoped></style>
