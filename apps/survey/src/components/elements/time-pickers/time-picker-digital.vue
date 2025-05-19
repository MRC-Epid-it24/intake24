<template>
  <div class="d-flex flex-row justify-center ga-4">
    <div class="d-flex flex-column align-center gr-2">
      <v-btn
        icon
        plain
        :size="60"
        @click="updateTime('hours', 1)"
      >
        <v-icon icon="fas fa-chevron-up" size="45" />
      </v-btn>
      <v-dialog
        v-model:modal="modal.hours"
        close-on-content-click
        max-width="360"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            class="time-element rounded-lg"
            color="grey-lighten-2"
            size="90"
          >
            {{ padLabel(time.hours) }}
          </v-btn>
        </template>
        <v-card class="d-flex align-center justify-center">
          <v-container>
            <v-row>
              <v-col cols="auto">
                <v-btn
                  v-for="(item, index) in selection.hours"
                  :key="index"
                  class="ma-2"
                  :color="time.hours === item ? 'primary' : 'grey-lighten-2'"
                  icon
                  rounded="circle"
                  @click="setTime('hours', item)"
                >
                  {{ padLabel(item) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-btn
        icon
        plain
        :size="60"
        @click="updateTime('hours', -1)"
      >
        <v-icon icon="fas fa-chevron-down" size="45" />
      </v-btn>
    </div>
    <div class="time-element d-flex align-center">
      <span :style="{ height: '90px' }">:</span>
    </div>
    <div class="d-flex flex-column align-center gr-2">
      <v-btn
        icon
        plain
        :size="60"
        @click="updateTime('minutes', 1)"
      >
        <v-icon icon="fas fa-chevron-up" size="45" />
      </v-btn>
      <v-dialog
        v-model:modal="modal.minutes"
        close-on-content-click
        max-width="360"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            class="time-element rounded-lg"
            color="grey-lighten-2"
            size="90"
          >
            {{ padLabel(time.minutes) }}
          </v-btn>
        </template>
        <v-card class="d-flex align-center justify-center">
          <v-container>
            <v-row>
              <v-col cols="auto">
                <v-btn
                  v-for="(item, index) in selection.minutes"
                  :key="index"
                  class="ma-2"
                  :color="time.minutes === item ? 'primary' : 'grey-lighten-2'"
                  icon
                  rounded="circle"
                  @click="setTime('minutes', item)"
                >
                  {{ padLabel(item) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-btn
        icon
        plain
        :size="60"
        @click="updateTime('minutes', -1)"
      >
        <v-icon icon="fas fa-chevron-down" size="45" />
      </v-btn>
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
const modal = ref({
  hours: false,
  minutes: false,
});

const selection = computed(() => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return {
    hours,
    minutes: props.allowedMinutes ? minutes.filter(props.allowedMinutes) : minutes,
  };
});

function padLabel(val: number) {
  return val.toString().padStart(2, '0');
}

function setTime(el: 'hours' | 'minutes', val: number) {
  const items = selection.value[el];
  const index = items.indexOf(time.value[el]);
  if (index === -1)
    return;

  time.value[el] = val;
  modal.value[el] = false;
}

function updateTime(el: 'hours' | 'minutes', val: number) {
  const items = selection.value[el];
  const index = items.indexOf(time.value[el]);

  if (index === -1)
    return;

  const newIndex = index + val;

  if (newIndex < 0) {
    time.value[el] = items[items.length - 1];

    if (el === 'minutes')
      updateTime('hours', -1);

    return;
  }

  if (newIndex >= items.length) {
    time.value[el] = items[0];

    if (el === 'minutes')
      updateTime('hours', 1);

    return;
  }

  time.value[el] = items[newIndex];
}

watch(time, (val) => {
  const time = fromMealTime(val);
  emit('update:modelValue', time);
}, { deep: true });
</script>

<style lang="scss">
.time-element {
  font-size: 56px;
}
</style>
