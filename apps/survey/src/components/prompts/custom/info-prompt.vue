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
    <div v-if="prompt.video" class="pa-4">
      <div class="iframe-container">
        <div ref="video" />
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { useYoutubeVideo } from '../partials';

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

    const updateAndAction = (type: string, ...args: [id?: string, params?: object]) => {
      state.value = type;
      action(type, ...args);
    };

    const { video, watched } = useYoutubeVideo(props.prompt, updateAndAction);

    const isValid = computed(() => !props.prompt.video?.required || watched.value);

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    return {
      customPromptLayout,
      isValid,
      state,
      updateAndAction,
      video,
    };
  },
});
</script>

<style lang="scss" scoped></style>
