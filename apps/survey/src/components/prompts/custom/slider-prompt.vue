<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-slider
          class="quantity-slider__slider px-8"
          color="secondary"
          :max="prompt.slider.max.value ?? undefined"
          :min="prompt.slider.min.value ?? undefined"
          :model-value="state"
          :step="prompt.slider.step"
          :thumb-label="prompt.slider.current ? `always` : false"
          :thumb-size="25"
          track-color="primary"
          track-size="12"
          @start="initialize"
          @update:model-value="state = $event"
        >
          <template #thumb-label="{ modelValue: thumbValue }">
            <div v-if="isInitialized" class="d-flex flex-column align-center pa-2">
              <span class="text-h5 font-weight-bold">{{ thumbValue }}</span>
              <span v-if="prompt.slider.current.label" class="text-h6 font-weight-bold">
                {{ translate(prompt.slider.current.label) }}
              </span>
            </div>
            <v-icon v-else class="fa-beat" color="white">
              fas fa-circle
            </v-icon>
          </template>
          <template #prepend>
            <div v-if="prompt.slider.min.label" class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ prompt.slider.min.value }}</span>
              <span class="text-h6 font-weight-bold">
                {{ translate(prompt.slider.min.label) }}
              </span>
            </div>
          </template>
          <template #append>
            <div v-if="prompt.slider.max.label" class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ prompt.slider.max.value }}</span>
              <span class="text-h6 font-weight-bold">
                {{ translate(prompt.slider.max.label) }}
              </span>
            </div>
          </template>
        </v-slider>
      </v-form>
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
import { computed, defineComponent, onMounted } from 'vue';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SliderPrompt',

  mixins: [createBasePrompt<'slider-prompt'>()],

  props: {
    modelValue: {
      type: Number as PropType<number>,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { translate } = useI18n();
    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    /*
     * State is updated on @change event of the slider
     * - expansion-header click trigger events on other components, including v-slider causing to emit @input with 0 value
     */
    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', typeof value === 'undefined' || value === null ? undefined : value);
      },
    });

    const isInitialized = computed(
      () => typeof state.value !== 'undefined' && state.value !== null,
    );

    const initialize = (value: number) => {
      if (isInitialized.value)
        return;

      state.value = value;
    };

    const isValid = computed(() => typeof props.modelValue !== 'undefined');

    onMounted(() => {
      if (typeof props.modelValue === 'undefined')
        state.value = props.prompt.slider.current.value ?? undefined;
    });

    return {
      action,
      customPromptLayout,
      initialize,
      isInitialized,
      isValid,
      state,
      translate,
    };
  },
});
</script>

<style lang="scss"></style>
