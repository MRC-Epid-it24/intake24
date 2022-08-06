<template>
  <div>
    <card-content
      v-bind="{ name, description }"
      @update:name="update('name', $event)"
      @update:description="update('description', $event)"
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

import type { FiveADay } from '@intake24/common/feedback';

import CardContent from '../partials/card-content.vue';
import CardThresholds from '../partials/card-thresholds.vue';
import CardUnit from '../partials/card-unit.vue';

export default defineComponent({
  name: 'FiveADayCard',

  components: { CardContent, CardThresholds, CardUnit },

  props: {
    name: {
      type: Object as PropType<FiveADay['name']>,
      required: true,
    },
    description: {
      type: Object as PropType<FiveADay['description']>,
      required: true,
    },
    high: {
      type: Object as PropType<FiveADay['high']>,
    },
    low: {
      type: Object as PropType<FiveADay['low']>,
    },
    unit: {
      type: Object as PropType<FiveADay['unit']>,
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
