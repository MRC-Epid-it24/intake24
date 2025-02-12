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

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { usePromptUtils } from '@intake24/survey/composables';
import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'TimePickerPrompt',

  mixins: [createBasePrompt<'time-picker-prompt'>()],

  props: {
    modelValue: {
      type: String as PropType<string | null>,
      default: null,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const allowedMinutes = computed(
      () => (minutes: number) => minutes % props.prompt.allowedMinutes === 0,
    );

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    const isValid = computed(() => !props.prompt.validation.required || !!state.value);

    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    return {
      action,
      allowedMinutes,
      customPromptLayout,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss">
</style>
