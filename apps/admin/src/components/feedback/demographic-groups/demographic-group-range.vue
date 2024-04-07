<template>
  <v-row>
    <v-col align-self="start" cols="12" md="6">
      <v-switch
        class="my-4"
        hide-details="auto"
        :input-value="!!value"
        :label="$t(`feedback-schemes.${type}._`)"
        :prepend-inner-icon="getIcon(type)"
        @change="toggleRange($event)"
      />
    </v-col>
    <v-col v-if="value" cols="12" md="6">
      <v-text-field
        class="mb-4"
        dense
        hide-details="auto"
        :label="$t('feedback-schemes.ranges.start')"
        name="range.start"
        outlined
        :value="value.start"
        @input="updateRange('start', $event)"
      />
      <v-text-field
        dense
        hide-details="auto"
        :label="$t('feedback-schemes.ranges.end')"
        name="range.end"
        outlined
        :value="value.end"
        @input="updateRange('end', $event)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Range } from '@intake24/common/feedback';

export type RangeType = 'age' | 'height' | 'weight';

export default defineComponent({
  name: 'DemographicGroupRange',

  props: {
    type: {
      type: String as PropType<RangeType>,
      required: true,
    },
    value: {
      type: Object as PropType<Range>,
      default: null,
    },
  },

  emits: ['input'],

  data() {
    const defaultRange: Range = { start: 0, end: 0 };

    return { defaultRange };
  },

  methods: {
    getIcon(type: RangeType): string {
      const icons = {
        age: 'fas fa-birthday-cake',
        height: 'fas fa-arrows-alt-v',
        weight: 'fas fa-weight',
      };

      return icons[type];
    },

    toggleRange(value: boolean) {
      this.$emit('input', value ? this.defaultRange : null);
    },

    updateRange(field: keyof Range, value: string) {
      const range = { ...(this.value ?? this.defaultRange), [field]: Number.parseFloat(value) };

      this.$emit('input', range);
    },
  },
});
</script>

<style lang="scss" scoped></style>
