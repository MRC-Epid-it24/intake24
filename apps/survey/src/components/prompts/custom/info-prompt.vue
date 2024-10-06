<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="updateAndAction"
  >
    <template #actions>
      <next :disabled="!isValid" @click="updateAndAction('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="updateAndAction('next')" />
    </template>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [createBasePrompt<'info-prompt'>()],

  props: {
    modelValue: {
      type: String,
      default: 'next',
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    const isValid = true;
    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    const updateAndAction = (type: string, ...args: [id?: string, params?: object]) => {
      state.value = type;
      action(type, ...args);
    };

    return {
      customPromptLayout,
      isValid,
      state,
      updateAndAction,
    };
  },
});
</script>

<style lang="scss" scoped></style>
