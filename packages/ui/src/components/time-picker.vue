<template>
  <v-time-picker
    v-bind="props"
    @update:hour="updateHour"
    @update:minute="updateMinute"
  />
</template>

<script lang="ts" setup>
/*
* Possible bug in v-time-picker
* - if time is predefined, modelValue does not emit only on hour-change
* * - handle hours/minutes cases separately
* */

import type { PropType } from 'vue';
import { fromMealTime, toMealTime } from '@intake24/common/surveys';

const props = defineProps({
  allowedMinutes: {
    type: [Array, Function] as PropType<number[] | ((val: number) => boolean)>,
  },
  color: {
    type: String,
  },
  format: {
    type: String as PropType<'ampm' | '24hr'>,
  },
  fullWidth: {
    type: Boolean,
  },
  landscape: {
    type: Boolean,
  },
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

function updateHour(hours: number) {
  if (!props.modelValue)
    return;

  const { minutes } = toMealTime(props.modelValue);

  emit('update:modelValue', fromMealTime({ hours, minutes }));
};

function updateMinute(minutes: number) {
  if (!props.modelValue)
    return;

  const { hours } = toMealTime(props.modelValue);

  emit('update:modelValue', fromMealTime({ hours, minutes }));
};
</script>
