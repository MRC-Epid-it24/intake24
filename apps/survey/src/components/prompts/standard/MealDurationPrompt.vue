<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-slider
          v-model="state"
          class="quantity-slider__slider px-8"
          color="secondary"
          :max="prompt.slider.max.value"
          :min="prompt.slider.min.value"
          :step="prompt.slider.step"
          :style="{ 'padding-top': `${prompt.slider.current.size + 10}px` }"
          :thumb-label="prompt.slider.current ? `always` : false"
          :thumb-size="prompt.slider.current.size"
        >
          <template #thumb-label="{ value }">
            <div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ value }}</span>
              <span v-if="prompt.slider.current.label" class="text-h6 font-weight-bold">
                {{ translate(prompt.slider.current.label) }}
              </span>
            </div>
          </template>
          <template #prepend>
            <span v-if="prompt.slider.min.label" class="text-h6 font-weight-bold">
              {{
                translate(prompt.slider.min.label, { params: { value: prompt.slider.min.value } })
              }}
            </span>
          </template>
          <template #append>
            <span v-if="prompt.slider.max.label" class="text-h6 font-weight-bold">
              {{
                translate(prompt.slider.max.label, { params: { value: prompt.slider.max.value } })
              }}
            </span>
          </template>
        </v-slider>
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')">
        {{ promptI18n.confirm }}
      </next>
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')">
        {{ promptI18n.confirm }}
      </next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealDurationPrompt',

  mixins: [createBasePrompt<'meal-duration-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    value: {
      type: Number,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { translate } = useI18n();
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    const isValid = computed(() => state.value !== null);
    const promptI18n = computed(() => translatePrompt(['minutes', 'confirm']));

    onMounted(() => {
      if (typeof props.value === 'undefined')
        state.value = props.prompt.slider.current.value ?? props.prompt.slider.min.value ?? 0;
    });

    return { action, isValid, promptI18n, state, translate };
  },
});
</script>

<style lang="scss"></style>
