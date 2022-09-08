<template>
  <standard-portion-prompt
    v-bind="{ promptComponent, promptProps, standardUnits }"
    :food-name="foodName()"
    @standard-portion-selected="onAnswer"
    @tempChanging="onTempChange"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import type { PromptAnswer, StandardPortionUnit } from '@intake24/common/types';
import StandardPortionPrompt from '@intake24/survey/components/prompts/portion/StandardPortionPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

import foodPromptUtils from '../mixins/food-prompt-utils';

interface StandardPortionData {
  unit: StandardPortionUnit;
  quantity: QuantityValues;
}

export default defineComponent({
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
      const { method, parameters } = this.selectedPortionSize();
      if (method !== 'standard-portion')
        throw new Error('Selected portion size method must be "standard-portion"');

      const units: StandardPortionUnit[] = [];

      const unitsCount = parseInt(parameters['units-count'], 10);

      for (let i = 0; i < unitsCount; ++i) {
        units.push({
          name: parameters[`unit${i}-name`],
          weight: parseFloat(parameters[`unit${i}-weight`]),
          omitFoodDescription: parameters[`unit${i}-omit-food-description`] === 'true',
        });
      }

      return units;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    onTempChange(tempStandardPortion: PromptAnswer) {
      // this.setTempPromptAnswer(tempStandardPortion);
    },

    onAnswer(data: StandardPortionData) {
      const { conversionFactor } = this.selectedPortionSize();

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
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
      // this.clearTempPromptAnswer();
    },

    onPartialAnswer(data: StandardPortionData) {
      console.log('Called onPartialAnswer');
      this.onAnswer(data);
    },
  },
});
</script>
