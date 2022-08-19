<template>
  <drink-scale-prompt
    ref="promptHandleChild"
    v-bind="{ promptProps }"
    :food-name="foodName()"
    :initial-fill-level="parameters['initial-fill-level']"
    :drinkware-id="parameters['drinkware-id']"
    :skip-fill-level="parameters['skip-fill-level']"
    :prompt-component="promptComponent"
    :initial-state="initialStateNotNull"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleParameters } from '@intake24/common/types/http';
import type { DrinkScalePromptState } from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import { createPromptHandlerStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import DrinkScalePrompt from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { useFoodGuideImageState } from '@intake24/survey/stores/guide-image';

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
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      currentState: null as DrinkScalePromptState | null,
    };
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
    ...mapActions(useFoodGuideImageState, ['updateFoodState', 'clearFoodState']),

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
          panelOpen: 0,
          minDrinkSliderValue: 0,
          originalImageUrlHeight: 0,
          originalImageUrlWidth: 0,
        }
      );
    },

    isValid(state: DrinkScalePromptState | null): boolean {
      if (state === null) return false;
      console.warn(
        'Validation check: ',
        state.objectIdx !== undefined && state.objectConfirmed && state.drinkConfirmed
      );
      return state.objectIdx !== undefined && state.objectConfirmed && state.drinkConfirmed;
    },

    getFoodOrMealId() {
      return this.selectedFood().id;
    },

    async commitAnswer() {
      if (this.currentState === null) throw new Error('currentState is null');

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: this.currentState.portionSize,
        },
      });
      this.clearStoredState();
    },
  },
});
</script>
