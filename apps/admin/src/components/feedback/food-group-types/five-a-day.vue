<template>
  <div>
    <food-group-content
      v-bind="{ name, description }"
      @update:name="update('name', $event)"
      @update:description="update('description', $event)"
    ></food-group-content>
    <food-group-thresholds
      :thresholds="{ high, low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    ></food-group-thresholds>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FiveADayFeedback } from '@intake24/common/feedback';
import FoodGroupContent from '../partials/food-group-content.vue';
import FoodGroupThresholds from '../partials/food-group-thresholds.vue';

export default defineComponent({
  name: 'FiveADay',

  components: { FoodGroupContent, FoodGroupThresholds },

  props: {
    name: {
      type: Object as PropType<FiveADayFeedback['name']>,
      required: true,
    },
    description: {
      type: Object as PropType<FiveADayFeedback['description']>,
      required: true,
    },
    high: {
      type: Object as PropType<FiveADayFeedback['high']>,
    },
    low: {
      type: Object as PropType<FiveADayFeedback['low']>,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
</script>
