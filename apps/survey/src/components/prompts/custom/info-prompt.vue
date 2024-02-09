<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="updateAndAction"
  >
    <template #actions>
      <next :disabled="!isValid" @click="updateAndAction('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="updateAndAction('next')"></next-mobile>
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
    value: {
      type: String,
      default: 'next',
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    const isValid = true;
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
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
