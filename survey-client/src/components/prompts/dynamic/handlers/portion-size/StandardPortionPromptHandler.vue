<template>
  <standard-portion-prompt
    :prompt-props="promptProps"
    :food-name="foodName"
    :standard-units="standardUnits"
    @standard-portion-selected="onStandardPortionSelected"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { BasePromptProps, QuantityValues } from '@common/prompts';
import { EncodedFood, StandardPortionUnit } from '@common/types';
import StandardPortionPrompt from '@/components/prompts/portion/StandardPortionPrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

interface StandardPortionData {
  unit: StandardPortionUnit;
  quantity: QuantityValues;
}

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  computed: {
    standardUnits(): StandardPortionUnit[] {
      if (this.selectedPortionSize.method !== 'standard-portion')
        throw new Error('Selected portion size method must be "standard-portion"');

      const units: StandardPortionUnit[] = [];

      const unitsCount = parseInt(this.selectedPortionSize.parameters['units-count'], 10);

      for (let i = 0; i < unitsCount; ++i) {
        units.push({
          name: this.selectedPortionSize.parameters[`unit${i}-name`],
          weight: parseFloat(this.selectedPortionSize.parameters[`unit${i}-weight`]),
          omitFoodDescription:
            this.selectedPortionSize.parameters[`unit${i}-omit-food-description`] === 'true',
        });
      }

      return units;
    },
  },

  methods: {
    onStandardPortionSelected(data: StandardPortionData) {
      const { conversionFactor } = this.selectedPortionSize;

      this.$store.commit('survey/updateFood', {
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        update: (state: EncodedFood) => {
          state.portionSize = {
            method: 'standard-portion',
            unit: data.unit,
            quantity: data.quantity,
            servingWeight:
              data.unit.weight * (data.quantity.whole + data.quantity.fraction) * conversionFactor,
            leftoversWeight: 0, // standard portion does not allow estimating leftovers
          };
        },
      });

      this.$emit('complete');
    },
  },
});
</script>
