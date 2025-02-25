<template>
  <base-layout
    v-bind="{ food, meal, prompt: prompt.prompts[panel ?? 0], section, isValid }"
    @action="action"
  >
    <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
      <component
        :is="item.component"
        v-for="(item, idx) in prompt.prompts"
        :key="idx"
        v-model="state[idx]"
        v-bind="{
          meal,
          food,
          prompt: item,
          section,
        }"
        @action="updatePanel(item, idx)"
      />
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import type { Prompt } from '@intake24/common/prompts';
import type { CustomPromptAnswer, FoodState } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';
import { Next, NextMobile } from './actions';
import customPrompts from './custom';
import { BaseLayout } from './layouts';
import { createBasePromptProps } from './prompt-props';

defineOptions({
  name: 'MultiPrompt',
  components: { ...customPrompts },
});

const props = defineProps({
  ...createBasePromptProps<'multi-prompt', FoodState>(),
  modelValue: {
    type: Array as PropType<(CustomPromptAnswer | undefined)[]>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action } = usePromptUtils(props, { emit }, confirm);

function isAnswerRequired(prompt: Prompt) {
  return !('validation' in prompt) || prompt.validation.required;
}

const isValid = computed(
  () =>
    !props.modelValue.some(
      (answer, idx) => answer === undefined && isAnswerRequired(props.prompt.prompts[idx]),
    ),
);
const panel = ref<number | undefined>(0);

const state = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

function confirm() {
  if (isValid.value)
    return true;

  return false;
}

function updatePanel(prompt: Prompt, idx: number) {
  if (state.value[idx] === undefined && !isAnswerRequired(prompt))
    state.value[idx] = null;

  for (const [index, answer] of Object.entries(props.modelValue)) {
    if (answer === undefined) {
      panel.value = Number.parseInt(index);
      return;
    }
  }

  panel.value = undefined;
}
</script>

<style lang="scss"></style>
