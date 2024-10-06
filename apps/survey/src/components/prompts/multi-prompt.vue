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

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { CustomPromptAnswer, FoodState } from '@intake24/common/types';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from './createBasePrompt';
import customPrompts from './custom';

export default defineComponent({
  name: 'MultiPrompt',

  components: { ...customPrompts },

  mixins: [createBasePrompt<'multi-prompt', FoodState>()],

  props: {
    modelValue: {
      type: Array as PropType<(CustomPromptAnswer | undefined)[]>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const isAnswerRequired = (prompt: Prompt) =>
      !('validation' in prompt) || prompt.validation.required;

    const isValid = computed(
      () =>
        !props.modelValue.some(
          (answer, idx) => answer === undefined && isAnswerRequired(props.prompt.prompts[idx]),
        ),
    );
    const panel = ref<number | undefined>(0);

    const state = computed({
      get: () => props.modelValue,
      set: value => ctx.emit('update:modelValue', value),
    });

    const confirm = () => {
      if (isValid.value)
        return true;

      return false;
    };

    const updatePanel = (prompt: Prompt, idx: number) => {
      if (state.value[idx] === undefined && !isAnswerRequired(prompt))
        state.value[idx] = null;

      for (const [index, answer] of Object.entries(props.modelValue)) {
        if (answer === undefined) {
          panel.value = Number.parseInt(index);
          return;
        }
      }

      panel.value = undefined;
    };

    const { action } = usePromptUtils(props, ctx, confirm);

    return {
      action,
      isValid,
      panel,
      state,
      updatePanel,
    };
  },
});
</script>

<style lang="scss"></style>
