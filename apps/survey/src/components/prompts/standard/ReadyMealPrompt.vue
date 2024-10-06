<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-card v-for="(food, idx) in state" :key="food.id" border class="mb-3">
        <v-card-text class="d-flex flex-column flex-sm-row justify-space-between gr-2">
          <div class="d-flex align-center">
            <v-btn class="bg-secondary font-weight-medium me-2" icon readonly size="x-small">
              {{ idx + 1 }}
            </v-btn>
            <span class="text-subtitle-1 font-weight-medium">{{ food.name }}</span>
          </div>
          <yes-no-toggle v-model="food.value" mandatory />
        </v-card-text>
      </v-card>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'ReadyMealPrompt',

  components: { YesNoToggle },

  mixins: [createBasePrompt<'ready-meal-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<PromptStates['ready-meal-prompt']>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });
    const isValid = computed(() => state.value.every(food => food.value !== undefined));

    return {
      action,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
