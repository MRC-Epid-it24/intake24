<template>
  <div>
    <card-unit v-bind="{ unit: value.unit }" @update:unit="update('unit', $event)" />
    <card-thresholds
      :thresholds="{ high: value.high, low: value.low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    />
    <v-tab-item key="json" value="json">
      <json-editor v-bind="{ value }" @input="$emit('input', $event)" />
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FiveADayCard } from '@intake24/common/feedback';
import { JsonEditor } from '@intake24/admin/components/editors';

import { CardThresholds, CardUnit } from '../partials';

export default defineComponent({
  name: 'FiveADayCard',

  components: { CardThresholds, CardUnit, JsonEditor },

  props: {
    value: {
      type: Object as PropType<FiveADayCard>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const update = (field: string, value: any) => {
      emit('input', { ...props.value, [field]: value });
    };

    return { update };
  },

});
</script>
