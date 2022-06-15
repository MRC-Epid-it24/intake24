<template>
  <v-row>
    <v-col cols="12" md="6" align-self="start">
      <v-switch
        :input-value="!!value"
        :label="$t(`feedback-schemes.${type}._`)"
        class="my-4"
        hide-details="auto"
        @change="toggleRange($event)"
        :prepend-icon="getIcon(type)"
      ></v-switch>
    </v-col>
    <v-col cols="12" md="6" v-if="value">
      <v-text-field
        :label="$t('feedback-schemes.ranges.start')"
        :value="value.start"
        class="mb-4"
        dense
        hide-details="auto"
        name="range.start"
        outlined
        @input="updateRange('start', $event)"
      ></v-text-field>
      <v-text-field
        :label="$t('feedback-schemes.ranges.end')"
        :value="value.end"
        dense
        hide-details="auto"
        name="range.end"
        outlined
        @input="updateRange('end', $event)"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from '@vue/composition-api';
import { defineComponent } from '@vue/composition-api';
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
      const range = { ...(this.value ?? this.defaultRange), [field]: parseFloat(value) };

      this.$emit('input', range);
    },
  },
});
</script>

<style lang="scss" scoped></style>
