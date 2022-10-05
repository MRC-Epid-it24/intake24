<template>
  <milk-in-a-hot-drink-prompt
    v-bind="{ continueEnabled, promptComponent, promptProps }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  ></milk-in-a-hot-drink-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  MilkInAHotDrinkPromptProps,
  PortionSizeComponentType,
} from '@intake24/common/prompts';
import type { MilkInAHotDrinkState } from '@intake24/survey/components/prompts/portion/MilkInAHotDrinkPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { MilkInAHotDrinkPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MilkInAHotDrinkPromptHandler',

  components: { MilkInAHotDrinkPrompt },

  mixins: [
    foodPromptUtils,
    createPromptHandlerStoreMixin<MilkInAHotDrinkState>('milk-in-a-hot-drink-prompt'),
  ],

  props: {
    promptProps: {
      type: Object as PropType<MilkInAHotDrinkPromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getFoodOrMealId(): number {
      return this.selectedFood().id;
    },

    getInitialState(): MilkInAHotDrinkState {
      return {
        milkPartIndex: null,
        milkVolumePercentage: null,
      };
    },

    isValid(state: MilkInAHotDrinkState): boolean {
      return state.milkPartIndex !== null && state.milkVolumePercentage !== null;
    },

    async commitAnswer() {
      const currentState = this.currentStateNotNull;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: {
            method: 'milk-in-a-hot-drink',
            milkPartIndex: currentState.milkPartIndex,
            milkVolumePercentage: currentState.milkVolumePercentage,
            servingWeight: 0,
            leftoversWeight: 0,
          },
        },
      });
    },
  },
});
</script>
