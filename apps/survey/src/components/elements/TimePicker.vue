<template>
  <div>
    <v-combobox
      class="cb-time-picker"
      hide-details
      :items="timeItems"
      label="Time"
      outlined
      :value="internalTime"
      @change="updateTime"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    allowedMinutes: {
      type: Number,
      required: true,
    },
    is12HourFormat: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const internalTime = ref(formatTime(props.value, props.is12HourFormat));
    const timeItems = computed(() => generateTimeItems(props.is12HourFormat));

    function generateTimeItems(is12HourFormat: boolean) {
      const period = is12HourFormat ? ['am', 'pm'] : [''];
      const hoursInDay = is12HourFormat ? 12 : 24;
      const minutesInHour = 60 / props.allowedMinutes;

      return period.flatMap(p =>
        Array.from({ length: hoursInDay }, (_, h) =>
          Array.from({ length: minutesInHour }, (_, m) => {
            const hour = is12HourFormat ? (h === 0 ? 12 : h) : h;
            const formattedHour = String(hour).padStart(2, '0');
            const formattedMinute = String(m * props.allowedMinutes).padStart(
              2,
              '0',
            );

            return `${formattedHour}:${formattedMinute}${p}`.trim();
          })).flat(),
      );
    }

    function convertTo24HourFormat(time: string) {
      const [timePart, period] = time.split(/(am|pm)/i);
      let [hours, minutes] = timePart.split(':').map(Number);

      if (period) {
        if (period.toLowerCase() === 'pm' && hours !== 12)
          hours += 12;
        else if (period.toLowerCase() === 'am' && hours === 12)
          hours = 0;
      }

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    function formatTime(time: string, is12HourFormat: boolean) {
      if (!time)
        return '';
      let [hours, minutes] = time.split(':').map(Number);

      let period = '';
      if (is12HourFormat) {
        period = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
      }

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;
    }

    function updateTime(value: string) {
      internalTime.value = value;
      emit('input', convertTo24HourFormat(value));
    }

    return {
      internalTime,
      timeItems,
      updateTime,
    };
  },
});
</script>

<style scoped lang="scss">
.cb-time-picker {
  width: 100%;

  @media (min-width: 600px) {
    width: 250px;
  }

  @media (min-width: 900px) {
    width: 300px;
  }

  @media (min-width: 1200px) {
    width: 350px;
  }
}
</style>
