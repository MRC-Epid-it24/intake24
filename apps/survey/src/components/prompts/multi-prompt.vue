<template>
  <base-layout
    v-bind="{ food, meal, prompt: prompt.prompts[panel ?? 0], section, isValid }"
    @action="action"
  >
    <v-expansion-panels v-model="panel" :tile="isMobile">
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
        @action="updatePanel"
      ></component>
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { CustomPromptAnswer, FoodState } from '@intake24/common/types';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from './createBasePrompt';
import customPrompts from './custom';

export default defineComponent({
  name: 'MultiPrompt',

  components: { ...customPrompts },

  mixins: [createBasePrompt<'multi-prompt', FoodState>()],

  props: {
    value: {
      type: Array as PropType<(CustomPromptAnswer | undefined)[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const isValid = computed(() => props.value.every((answer) => answer !== undefined));
    const panel = ref<number | undefined>(0);

    const state = computed({
      get: () => props.value,
      set: (value) => ctx.emit('input', value),
    });

    const confirm = () => {
      if (isValid.value) return true;

      return false;
    };

    const updatePanel = () => {
      for (const [index, answer] of Object.entries(props.value)) {
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
