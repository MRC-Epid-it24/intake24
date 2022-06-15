<template>
  <standard-portion-prompt
    v-bind="{ foodName, promptProps, standardUnits }"
    :prompt-component="promptComponent"
    @standard-portion-selected="onAnswer"
    @tempChanging="onTempChange"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import type { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import type { HasOnAnswer, PromptAnswer, StandardPortionUnit } from '@intake24/common/types';
import StandardPortionPrompt from '@intake24/survey/components/prompts/portion/StandardPortionPrompt.vue';
import { mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

interface StandardPortionData {
  unit: StandardPortionUnit;
  quantity: QuantityValues;
}

export default (Vue as VueConstructor<Vue & Mixins & HasOnAnswer>).extend({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
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
    ...mapActions(useSurvey, ['updateFood', 'setTempPromptAnswer', 'clearTempPromptAnswer']),

    onTempChange(tempStandardPortion: PromptAnswer) {
      this.setTempPromptAnswer(tempStandardPortion);
    },

    onAnswer(data: StandardPortionData) {
      const { conversionFactor } = this.selectedPortionSize;

      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.warn('No selected meal/food, meal/food index undefined');
        return;
      }

      this.updateFood({
        mealIndex,
        foodIndex,
        food: {
          portionSize: {
            method: 'standard-portion',
            unit: data.unit,
            quantity: data.quantity,
            servingWeight:
              data.unit.weight * (data.quantity.whole + data.quantity.fraction) * conversionFactor,
            leftoversWeight: 0, // standard portion does not allow estimating leftovers
          },
        },
      });

      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onPartialAnswer(data: StandardPortionData) {
      console.log('Called onPartialAnswer');
      this.onAnswer(data);
    },
  },
});
</script>
