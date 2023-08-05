<template>
  <v-overlay absolute :dark="false" :opacity="0.2" :value="show">
    <v-card class="card-overlay" flat :tile="isMobile">
      <v-card-text class="d-flex flex-column align-center">
        <v-btn
          v-if="!isMobile"
          class="mb-3"
          color="primary"
          :disabled="numerator === maxNumerator"
          icon
          large
          outlined
          :title="$t(`prompts.asServed.${type}.more`)"
          @click="update(1)"
        >
          <v-icon aria-hidden="false">$increment</v-icon>
        </v-btn>
        <v-chip color="grey lighten-1">
          <i18n
            class="font-weight-medium text-h6"
            :path="`prompts.asServed.weightFactor.${type}.${subType}`"
          >
            <template #whole>
              <span class="font-weight-bold">{{ whole }}</span>
            </template>
            <template #fraction>
              <span class="font-weight-bold">{{ fraction }}</span>
            </template>
          </i18n>
        </v-chip>
        <span class="my-1 font-weight-medium text-h6">
          {{ $t(`prompts.asServed.weightFactor.${subType}`) }}
        </span>
        <span class="mb-3 font-weight-medium text-h6">
          (<span class="font-weight-bold">{{ amount }}g</span>)
        </span>
        <div>
          <v-btn
            color="primary"
            :disabled="numerator === minNumerator"
            icon
            large
            outlined
            :title="$t(`prompts.asServed.${type}.less`)"
            @click="update(-1)"
          >
            <v-icon aria-hidden="false">$decrement</v-icon>
          </v-btn>
          <v-btn
            v-if="isMobile"
            class="ml-6"
            color="primary"
            :disabled="numerator === maxNumerator"
            icon
            large
            outlined
            :title="$t(`prompts.asServed.${type}.more`)"
            @click="update(1)"
          >
            <v-icon aria-hidden="false">$increment</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { VChip } from 'vuetify/lib';

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

  components: { VChip },

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

  emits: ['input'],

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

<style lang="scss" scoped>
.card-overlay {
  background-color: rgb(white, 0.8);
}
</style>
