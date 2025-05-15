<template>
  <div class="d-flex flex-row justify-center items-center ga-4 rounded-pill">
    <div class="d-flex flex-column align-center gr-2">
      <button
        class="triangle-up"
        :title="$t('prompts.quantity.more')"
        @click="update(1)"
      />
      <v-select
        v-model="time.hours"
        hide-details
        :items="hours"
      />
      <button
        class="triangle-down"
        :title="$t('prompts.quantity.less')"
        @click="update(-1)"
      />
    </div>
    <div class="d-flex flex-column align-center gr-2">
      <button
        class="triangle-up"
        :title="$t('prompts.quantity.more')"
        @click="update(1)"
      />
      <v-select
        v-model="time.minutes"
        hide-details="auto"
        :items="minutes"
      />
      <button
        class="triangle-down"
        :title="$t('prompts.quantity.less')"
        @click="update(-1)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
import { fromMealTime, toMealTime } from '@intake24/common/surveys';

const props = defineProps({
  allowedMinutes: {
    type: Function as PropType<(val: number) => boolean>,
  },
  amPmToggle: {
    type: Boolean as PropType<boolean>,
  },
  format: {
    type: String as PropType<'ampm' | '24hr'>,
  },
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const time = ref(toMealTime(props.modelValue ?? '00:00'));

const hours = computed(() => {
  const vals = Array.from({ length: 25 }, (_, i) => i);
  return vals;
});
const minutes = computed(() => {
  const vals = Array.from({ length: 60 }, (_, i) => i);
  if (!props.allowedMinutes)
    return vals;

  return vals.filter(props.allowedMinutes);
});

function update(_val: number) {
//
}

watch(time, (val) => {
  const time = fromMealTime(val);
  console.log('Time:', val, time);
  emit('update:modelValue', time);
}, { deep: true });
</script>

<style lang="scss">
.triangle-up {
  --r: 10px;

  width: 100%;
  aspect-ratio: 1 / cos(30deg);
  --_g: calc(tan(60deg) * var(--r)) bottom var(--r), #000 98%, #0000 101%;
  -webkit-mask:
    conic-gradient(from -30deg at 50% calc(200% - 3 * var(--r) / 2), #000 60deg, #0000 0) 0 100%/100%
      calc(100% - 3 * var(--r) / 2) no-repeat,
    radial-gradient(var(--r) at 50% calc(2 * var(--r)), #000 98%, #0000 101%),
    radial-gradient(var(--r) at left var(--_g)),
    radial-gradient(var(--r) at right var(--_g));
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  background: rgba(var(--v-theme-secondary));
}

.triangle-down {
  --r: 10px;

  width: 100%;
  aspect-ratio: 1 / cos(30deg);
  --_g: calc(tan(60deg) * var(--r)) top var(--r), #000 98%, #0000 101%;
  -webkit-mask:
    conic-gradient(from 150deg at 50% calc(3 * var(--r) / 2 - 100%), #000 60deg, #0000 0) 0 0/100%
      calc(100% - 3 * var(--r) / 2) no-repeat,
    radial-gradient(var(--r) at 50% calc(100% - 2 * var(--r)), #000 98%, #0000 101%),
    radial-gradient(var(--r) at left var(--_g)),
    radial-gradient(var(--r) at right var(--_g));
  clip-path: polygon(50% 100%, 100% 0, 0 0);
  background: rgba(var(--v-theme-secondary));
}
</style>
