<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </card-layout>
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
      default: 'ok',
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const isValid = true;
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    return {
      action,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
