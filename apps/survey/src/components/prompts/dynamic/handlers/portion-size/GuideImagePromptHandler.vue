<template>
  <guide-image-prompt
    ref="promptHandleChild"
    v-bind="{ promptProps }"
    :food-name="foodName()"
    :guide-image-id="parameters['guide-image-id']"
    :prompt-component="promptComponent"
    :conversionFactor="selectedPortionSize().conversionFactor"
    :initial-state="initialStateNotNull"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { GuideImageParameters } from '@intake24/common/types/http';
import type { GuideImagePromptState } from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';
import { createPromptHandlerStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-store';
import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

import FoodPromptUtils from '../mixins/food-prompt-utils';

export default defineComponent({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

  mixins: [
    FoodPromptUtils,
    MealPromptUtils,
    createPromptHandlerStoreMixin<GuideImagePromptState>('guide-image-prompt'),
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
  },

  computed: {
    parameters(): GuideImageParameters {
      if (this.selectedPortionSize().method !== 'guide-image')
        throw new Error('Selected portion size method must be "guide-image"');

      return this.selectedPortionSize().parameters as unknown as GuideImageParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getFoodOrMealId() {
      return this.selectedFood().id;
    },

    getInitialState(): GuideImagePromptState {
      return (
        this.encodedSelectedFood().id,
        this.promptId,
        {
          portionSize: {
            method: 'guide-image',
            object: null,
            quantity: { whole: 1, fraction: 0 },
            servingWeight: 0,
            leftoversWeight: 0,
          },
          objectConfirmed: false,
          quantityConfirmed: false,
          objectIdx: undefined,
          panelOpen: 0,
        }
      );
    },

    isValid(state: GuideImagePromptState | null): boolean {
      if (state === null) return false;

      return state.objectIdx !== undefined && state.objectConfirmed && state.quantityConfirmed;
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
