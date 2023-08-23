<template>
  <div>
    <card-content
      v-bind="{ name, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
    ></card-content>
    <card-unit v-bind="{ unit }" @update:unit="update('unit', $event)"></card-unit>
    <card-thresholds
      :thresholds="{ high, low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    ></card-thresholds>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FiveADayCard } from '@intake24/common/feedback';

import { CardContent, CardThresholds, CardUnit } from '../partials';

export default defineComponent({
  name: 'FiveADayCard',

  components: { CardContent, CardThresholds, CardUnit },

  props: {
    name: {
      type: Object as PropType<FiveADayCard['name']>,
      required: true,
    },
    description: {
      type: Object as PropType<FiveADayCard['description']>,
      required: true,
    },
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
