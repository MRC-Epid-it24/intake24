<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <component
        :is="`time-picker-${prompt.ui}`"
        v-model="state"
        :prompt="prompt"
      />
    </v-card-text>
    <template #actions>
      <v-btn
        :title="promptI18n.no"
        @click.stop="action('cancel')"
      >
        {{ promptI18n.no }}
      </v-btn>
      <v-btn
        :title="promptI18n.yes"
        variant="flat"
        @click.stop="action('next')"
      >
        {{ promptI18n.yes }}
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { fromMealTime, toMealTime } from '@intake24/common/surveys';
import type { MealState, MealTime } from '@intake24/common/surveys';
import { timePickers } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';
import { CardLayout } from '../layouts';
import { createBasePromptProps } from '../prompt-props';

defineOptions({
  components: { ...timePickers },
});

const props = defineProps({
  ...createBasePromptProps<'meal-time-prompt'>(),
  meal: {
    type: Object as PropType<MealState>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<MealTime>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, translatePrompt } = usePromptUtils(props, { emit });

const promptI18n = computed(() => translatePrompt(['no', 'yes']));
const state = computed({
  get() {
    return fromMealTime(props.modelValue);
  },
  set(value) {
    emit('update:modelValue', toMealTime(value));
  },
});
const isValid = computed(() => !!state.value);
</script>

<style lang="scss">
</style>
