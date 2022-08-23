<template>
  <v-row align="center" justify="center">
    <v-col v-if="whole" md="auto">
      <v-card align="center" class="px-4" justify="center">
        <v-row>
          <v-col>
            <v-btn icon text @click="modifyWhole(1)">
              <v-icon aria-hidden="false">fas fa-fw fa-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>{{ wholeNum }}</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn icon text @click="modifyWhole(-1)">
              <v-icon aria-hidden="false">fas fa-fw fa-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col v-if="whole && fraction" align="center" justify="center" md="auto">
      {{ $t('portion.common.quantityAnd') }}
    </v-col>
    <v-col v-if="fraction" md="auto">
      <v-card align="center" class="px-4" justify="center">
        <v-row>
          <v-col>
            <v-btn icon text @click="modifyFrac(0.25)">
              <v-icon aria-hidden="false">fas fa-fw fa-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col> {{ displayFrac() }} </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn icon text @click="modifyFrac(-0.25)">
              <v-icon aria-hidden="false">fas fa-fw fa-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { QuantityValues } from '@intake24/common/prompts';

export default defineComponent({
  name: 'QuantityCard',
  // Purpose: Card that renders whole, fraction, or both, quantity counters for food items

  // Should probably fail if both are false as nothing to display
  props: {
    whole: Boolean,
    fraction: Boolean,
  },

  data() {
    return {
      wholeNum: 1,
      fracNum: 0.0,
    };
  },

  methods: {
    modifyWhole(value: number) {
      // Test we only subtract 1 from value
      if (value >= -1 && value <= 1) {
        // Currently no upper limit
        if (this.wholeNum + value >= 0) {
          this.wholeNum += value;
          const emitValues: QuantityValues = { whole: this.wholeNum, fraction: this.fracNum };
          this.$emit('update-quantity', emitValues);
        }
      }
    },
    modifyFrac(value: number) {
      if (this.fracNum + value >= 0 && this.fracNum + value < 1) {
        this.fracNum += value;
        const emitValues: QuantityValues = { whole: this.wholeNum, fraction: this.fracNum };
        this.$emit('update-quantity', emitValues);
      }
    },
    displayFrac(): string {
      switch (this.fracNum) {
        case 0.25:
          return '1/4';
        case 0.5:
          return '1/2';
        case 0.75:
          return '3/4';
        default:
          return this.fracNum.toString();
      }
    },
  },
});
</script>

<style></style>
