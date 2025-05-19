<template>
  <v-time-picker
    v-model="state"
    :allowed-minutes="allowedMinutes"
    :ampm-in-title="amPmToggle"
    class="time-picker pa-0 mx-auto"
    :format="format"
    :landscape="$vuetify.display.smAndUp"
  />
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
  allowedMinutes: {
    type: Function as PropType<(val: number) => boolean>,
  },
  amPmToggle: {
    type: Boolean as PropType<boolean>,
  },
  format: {
    type: String as PropType<'ampm' | '24hr'>,
  },
});

const state = defineModel('modelValue', { type: String as PropType<string | null>, default: null });
</script>

<style lang="scss">
.time-picker {
  .v-picker-title {
    display: none;
  }

  .v-time-picker-controls {
    margin-bottom: 16px;
  }

  // Vuetify landscape is broken
  .v-picker--landscape {
    grid-template-areas: 'header body';
    width: unset !important;

    .v-picker__header {
      height: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .v-time-picker-controls__ampm__btn {
    border: unset !important;
  }
}
</style>
