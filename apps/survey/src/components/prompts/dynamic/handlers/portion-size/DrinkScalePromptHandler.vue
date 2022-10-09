<template>
  <drink-scale-prompt
    v-bind="{ continueEnabled, parameters, promptComponent, promptProps }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { DrinkScaleParameters } from '@intake24/common/types/http';
import type { DrinkScalePromptState } from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import { createPromptHandlerStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

import foodPromptUtils from '../mixins/food-prompt-utils';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  mixins: [
    foodPromptUtils,
    createPromptHandlerStoreMixin<DrinkScalePromptState>('drink-scale-prompt'),
  ],

  props: {
    promptProps: {
      type: Object as PropType<DrinkScalePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
  },

  computed: {
    parameters(): DrinkScaleParameters {
      if (this.selectedPortionSize().method !== 'drink-scale')
        throw new Error('Selected portion size method must be "drink-scale"');

      return this.selectedPortionSize().parameters as unknown as DrinkScaleParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getInitialState(): DrinkScalePromptState {
      return (
        this.encodedSelectedFood().id,
        this.promptId,
        {
          portionSize: {
            method: 'drink-scale',
            leftoversLevel: 0,
            initialFillLevel: '0.9',
            fillLevel: 0,
            skipFillLevel: 'false',
            imageUrl: '',
            leftoversWeight: 0,
            drinkwareId: '',
            containerIndex: 0,
            leftovers: false,
            servingWeight: 0,
          },
          objectConfirmed: false,
          drinkConfirmed: false,
          leftoversConfirmed: false,
          objectIdx: undefined,
          drinkOverlayUrl: '',
          maxDrinkSliderValue: 100,
          panel: 0,
          minDrinkSliderValue: 0,
          originalImageUrlHeight: 0,
          originalImageUrlWidth: 0,
        }
      );
    },

    isValid(state: DrinkScalePromptState | null): boolean {
      if (state === null) return false;
      return state.objectIdx !== undefined && state.objectConfirmed && state.drinkConfirmed;
    },

    getFoodOrMealId() {
      return this.selectedFood().id;
    },

    async commitAnswer() {
      const { portionSize } = this.currentStateNotNull;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: { portionSize },
      });
      this.clearStoredState();
    },
  },
});
</script>
