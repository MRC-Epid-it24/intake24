<template>
  <standard-portion-prompt
    v-bind="{ continueEnabled, parameters, promptComponent, promptProps }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  PortionSizeComponentType,
  StandardPortionPromptProps,
} from '@intake24/common/prompts';
import type { StandardPortionParams } from '@intake24/common/types/http';
import type { StandardPortionPromptState } from '@intake24/survey/components/prompts/portion/StandardPortionPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { StandardPortionPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

  mixins: [
    foodPromptUtils,
    createPromptHandlerStoreMixin<StandardPortionPromptState>('standard-portion-prompt'),
  ],

  props: {
    promptProps: {
      type: Object as PropType<StandardPortionPromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
  },

  computed: {
    parameters(): StandardPortionParams {
      if (this.selectedPortionSize().method !== 'standard-portion')
        throw new Error('Selected portion size method must be "standard-portion"');

      return this.selectedPortionSize().parameters as unknown as StandardPortionParams;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getFoodOrMealId(): number {
      return this.selectedFood().id;
    },

    getInitialState(): StandardPortionPromptState {
      return {
        portionSize: {
          method: 'standard-portion',
          unit: null,
          quantity: { whole: 1, fraction: 0 },
          servingWeight: 0,
          leftoversWeight: 0,
        },
        panel: 0,
        quantityConfirmed: false,
      };
    },

    isValid(state: StandardPortionPromptState): boolean {
      return state.portionSize.unit !== null && state.quantityConfirmed;
    },

    commitAnswer() {
      const { portionSize } = this.currentStateNotNull;
      const { conversionFactor } = this.selectedPortionSize();

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: {
            ...portionSize,
            servingWeight:
              (portionSize.unit?.weight ?? 0) *
              ((portionSize.quantity?.whole ?? 0) + (portionSize.quantity?.fraction ?? 0)) *
              conversionFactor,
          },
        },
      });
    },
  },
});
</script>
