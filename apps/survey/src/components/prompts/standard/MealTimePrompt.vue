<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
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
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.no"
        variant="text"
        @click.stop="action('cancel')"
      >
        {{ promptI18n.no }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.yes"
        @click.stop="action('next')"
      >
        {{ promptI18n.yes }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="promptI18n.no" variant="text" @click.stop="action('cancel')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">
          $cancel
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn
        color="primary"
        :disabled="!isValid"
        :title="promptI18n.yes"
        @click.stop="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1">
          $next
        </v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import { fromMealTime, toMealTime } from '@intake24/common/surveys';
import type { MealState, MealTime } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [createBasePrompt<'meal-time-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<MealTime>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const allowedMinutes = computed(
      () => (minutes: number) => minutes % props.prompt.allowedMinutes === 0,
    );
    const promptI18n = computed(() => translatePrompt(['no', 'yes']));
    const state = computed({
      get() {
        return fromMealTime(props.modelValue);
      },
      set(value) {
        ctx.emit('update:modelValue', toMealTime(value));
      },
    });
    const isValid = computed(() => !!state.value);

    return {
      action,
      allowedMinutes,
      isValid,
      promptI18n,
      state,
    };
  },
});
</script>

<style lang="scss">
</style>
