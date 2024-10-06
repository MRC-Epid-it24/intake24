<template>
  <div>
    <card-unit v-bind="{ unit: modelValue.unit }" @update:unit="update('unit', $event)" />
    <card-thresholds
      :thresholds="{ high: modelValue.high, low: modelValue.low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    />
    <v-tabs-window-item key="json" value="json">
      <json-editor v-bind="{ modelValue }" @update:model-value="$emit('update:modelValue', $event)" />
    </v-tabs-window-item>
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
    modelValue: {
      type: Object as PropType<FiveADayCard>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const update = (field: string, value: any) => {
      emit('update:modelValue', { ...props.modelValue, [field]: value });
    };

    return { update };
  },

});
</script>
