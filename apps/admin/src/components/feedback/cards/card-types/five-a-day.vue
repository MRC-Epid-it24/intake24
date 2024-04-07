<template>
  <div>
    <card-unit v-bind="{ unit }" @update:unit="update('unit', $event)" />
    <card-thresholds
      :thresholds="{ high, low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FiveADayCard } from '@intake24/common/feedback';

import { CardThresholds, CardUnit } from '../partials';

export default defineComponent({
  name: 'FiveADayCard',

  components: { CardThresholds, CardUnit },

  props: {
    high: {
      type: Object as PropType<FiveADayCard['high']>,
      default: null,
    },
    low: {
      type: Object as PropType<FiveADayCard['low']>,
      default: null,
    },
    unit: {
      type: Object as PropType<FiveADayCard['unit']>,
      required: true,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
</script>
