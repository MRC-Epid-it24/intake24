<template>
  <div class="analog-clock-picker">
    <div class="dial-container">
      <svg aria-live="polite" class="dial" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="dialGradient" fx="50%" fy="50%" r="70%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#f0f0f0" />
          </radialGradient>
          <filter id="handShadow" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="0" flood-color="#000" flood-opacity="0.15" stdDeviation="1" />
          </filter>
        </defs>
        <!-- Background ring -->
        <circle cx="50" cy="50" fill="url(#dialGradient)" r="48" stroke="#ccc" stroke-width="1" />
        <g v-if="isAM">
          <text fill="#444" font-size="8" text-anchor="middle" x="50" y="64">☀︎</text>
        </g>
        <g v-else>
          <!-- outer halo -->
          <text fill="#444" font-size="9" text-anchor="middle" x="50" y="64">☾</text>
        </g>
        <!-- Minute ticks -->
        <g class="ticks">
          <line
            v-for="i in 60"
            :key="i"
            stroke="#888"
            :stroke-width="i % 5 === 0 ? 2 : 1"
            :transform="`rotate(${i * 6} 50 50)`"
            x1="50"
            x2="50"
            y1="5"
            y2="8"
          />
        </g>
        <!-- Quarter labels -->
        <text fill="#444" text-anchor="middle" x="50" y="22">12</text>
        <text fill="#444" text-anchor="middle" x="86" y="54">3</text>
        <text fill="#444" text-anchor="middle" x="50" y="88">6</text>
        <text fill="#444" text-anchor="middle" x="14" y="54">9</text>
        <!-- Hands: render hour-hand first, minute-hand on top -->
        <line
          class="hour-hand"
          filter="url(#handShadow)"
          stroke="#333"
          stroke-linecap="round"
          stroke-width="3"
          x1="50"
          :x2="hourX"
          y1="50"
          :y2="hourY"
        />
        <line
          class="minute-hand"
          filter="url(#handShadow)"
          stroke="#333"
          stroke-linecap="round"
          stroke-width="2"
          x1="50"
          :x2="minuteX"
          y1="50"
          :y2="minuteY"
        />
        <!-- Center knob -->
        <circle cx="50" cy="50" fill="#333" r="2.5" />
      </svg>
    </div>
    <div class="digital-display">
      {{ formattedTime }}
    </div>
    <div class="manual-input mt-4">
      <label class="sr-only" for="manual-time">Enter time manually</label>
      <input
        id="manual-time"
        v-model="manualTime"
        class="border rounded px-2 py-1"
        type="time"
      >
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'AnalogClockPicker',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    allowedMinutes: {
      type: Function as PropType<(min: number) => boolean>,
      default: () => (_min: number) => true,
    },
    format: {
      type: String,
      default: '24hr',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const hour = ref(0);
    const minute = ref(0);

    const parseTime = (time: string) => {
      const [h = 0, m = 0] = time.split(':').map(Number);
      hour.value = h;
      minute.value = m;
    };

    // Initialize time from modelValue and watch for updates
    parseTime(props.modelValue);
    watch(() => props.modelValue, val => parseTime(val));

    const hourAngle = computed(() => (hour.value % 12) * 30 + (minute.value / 60) * 30);
    const minuteAngle = computed(() => minute.value * 6);

    const polarToCartesian = (angle: number, length: number) => {
      const radians = (Math.PI / 180) * angle;
      const x = 50 + length * Math.sin(radians);
      const y = 50 - length * Math.cos(radians);
      return { x, y };
    };

    const hourPos = computed(() => polarToCartesian(hourAngle.value, 22));
    const minutePos = computed(() => polarToCartesian(minuteAngle.value, 32));

    const formattedTime = computed(() => props.modelValue);
    const isAM = computed(() => hour.value < 12);
    const dialGradientId = 'dialGradient';

    // Emit updates when time changes (e.g., on drag)
    watch([hour, minute], () => {
      const hh = String(hour.value).padStart(2, '0');
      const mm = String(minute.value).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;
      emit('update:modelValue', timeStr);
    });

    // Manual time input fallback
    const manualTime = computed<string>({
      get() {
        const hh = String(hour.value).padStart(2, '0');
        const mm = String(minute.value).padStart(2, '0');
        return `${hh}:${mm}`;
      },
      set(val: string) {
        const [hStr, mStr] = val.split(':');
        const h = Number(hStr);
        const m = Number(mStr);
        if (!Number.isNaN(h) && !Number.isNaN(m)) {
          hour.value = h;
          minute.value = m;
        }
      },
    });

    return {
      hourX: computed(() => hourPos.value.x),
      hourY: computed(() => hourPos.value.y),
      minuteX: computed(() => minutePos.value.x),
      minuteY: computed(() => minutePos.value.y),
      isAM,
      dialGradientId,
      formattedTime,
      manualTime,
    };
  },
});
</script>

<style scoped lang="scss">
.analog-clock-picker {
  display: flex;
  flex-direction: column;
  align-items: center;

  .dial-container {
    width: 12rem;
    height: 12rem;

    .dial {
      width: 100%;
      height: 100%;
      .ticks line {
        shape-rendering: crispEdges;
      }
      .hour-hand,
      .minute-hand {
        transition: transform 0.3s ease-in-out;
        transform-origin: 50% 50%;
      }
    }
  }

  .digital-display {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
}
</style>
