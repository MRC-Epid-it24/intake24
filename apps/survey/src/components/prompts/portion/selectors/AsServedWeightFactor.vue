<template>
  <v-overlay absolute :dark="false" :value="show">
    <div class="d-flex justify-center align-center">
      <v-card>
        <v-card-text>
          <div class="d-flex flex-column align-center">
            <v-btn
              color="primary"
              :disabled="numerator === maxNumerator"
              icon
              large
              outlined
              @click="update(1)"
            >
              <v-icon aria-hidden="false">fas fa-fw fa-plus</v-icon>
            </v-btn>
            <span class="mt-3 font-weight-medium text-h6">
              {{ $t(`prompts.asServed.weightFactor.${type}.${subType}`, { whole, fraction }) }}
            </span>
            <span class="my-1 font-weight-medium text-h6">
              {{ $t(`prompts.asServed.weightFactor.${subType}`) }}
            </span>
            <span class="mb-3 font-weight-medium text-h6">
              {{ $t(`prompts.asServed.weightFactor.weight`, { amount }) }}
            </span>
            <v-btn
              color="primary"
              :disabled="numerator === minNumerator"
              icon
              large
              outlined
              @click="update(-1)"
            >
              <v-icon aria-hidden="false">fas fa-fw fa-minus</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export type WeightFactorProps = {
  show: boolean;
  type: 'serving' | 'leftovers';
  subType: 'less' | 'more';
  minNumerator: number;
  maxNumerator: number;
  denominator: number;
  weight: number;
  value: number;
};

export default defineComponent({
  name: 'AsServedWeightFactor',

  props: {
    show: {
      type: Boolean as PropType<WeightFactorProps['show']>,
      required: true,
    },
    denominator: {
      type: Number as PropType<WeightFactorProps['denominator']>,
      required: true,
    },
    minNumerator: {
      type: Number as PropType<WeightFactorProps['minNumerator']>,
      required: true,
    },
    maxNumerator: {
      type: Number as PropType<WeightFactorProps['maxNumerator']>,
      required: true,
    },
    type: {
      type: String as PropType<WeightFactorProps['type']>,
      required: true,
    },
    subType: {
      type: String as PropType<WeightFactorProps['subType']>,
      required: true,
    },
    weight: {
      type: Number as PropType<WeightFactorProps['weight']>,
      required: true,
    },
    value: {
      type: Number as PropType<WeightFactorProps['value']>,
      required: true,
    },
  },

  data() {
    return {
      numerator: this.value,
    };
  },

  computed: {
    amount() {
      return ((this.numerator / this.denominator) * this.weight).toFixed(2);
    },
    whole() {
      return Math.floor(this.numerator / this.denominator);
    },
    fraction(): string {
      const fraction = this.numerator / this.denominator - this.whole;

      switch (fraction) {
        case 0.25:
          return '¼';
        case 0.5:
          return '½';
        case 0.75:
          return '¾';
        default:
          return fraction.toString();
      }
    },
  },

  watch: {
    show(val: boolean) {
      if (!val) return;

      this.numerator = this.value;
    },
  },

  methods: {
    update(value: number) {
      this.numerator =
        value > 0
          ? Math.min(this.maxNumerator, this.numerator + value)
          : Math.max(this.minNumerator, this.numerator + value);

      this.$emit('input', this.numerator);
    },
  },
});
</script>

<style lang="scss" scoped></style>
