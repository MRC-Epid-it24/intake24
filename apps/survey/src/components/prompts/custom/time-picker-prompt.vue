<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2 time-picker">
      <v-time-picker
        v-model="state"
        :allowed-minutes="allowedMinutes"
        :ampm-in-title="prompt.amPmToggle"
        class="pa-0 mx-auto"
        :format="prompt.format"
        :landscape="$vuetify.display.smAndUp"
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
import { computed } from 'vue';
import { usePromptUtils } from '@intake24/survey/composables';
import { Next, NextMobile } from '../actions';
import { BaseLayout, CardLayout, PanelLayout } from '../layouts';
import { createBasePromptProps } from '../prompt-props';

defineOptions({
  name: 'TimePickerPrompt',
  components: { BaseLayout, CardLayout, PanelLayout },
});

const props = defineProps({
  ...createBasePromptProps<'time-picker-prompt'>(),
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, customPromptLayout } = usePromptUtils(props, { emit });
const state = defineModel('modelValue', { type: String as PropType<string | null>, default: null });

const allowedMinutes = computed(
  () => (minutes: number) => minutes % props.prompt.allowedMinutes === 0,
);
const isValid = computed(() => !props.prompt.validation.required || !!state.value);
</script>

<style lang="scss">
</style>
