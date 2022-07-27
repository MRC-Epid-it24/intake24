<template>
  <guide-image-prompt
    ref="promptHandleChild"
    v-bind="{ foodName, promptProps, selectedFoodIndex, selectedMealIndex }"
    :guide-image-id="parameters['guide-image-id']"
    :prompt-component="promptComponent"
    :conversionFactor="selectedPortionSize.conversionFactor"
    :initial-state="initialState"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import type { BasePromptProps } from '@intake24/common/prompts';
// import type { GuideImageEncodedFood } from '@intake24/survey/stores/guide-image';
import type { GuideImageParameters } from '@intake24/common/types/http';
import type { GuideImagePromptState } from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';
import { createPromptHandlerMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';

export default defineComponent({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

  mixins: [foodPromptUtils, createPromptHandlerMixin<GuideImagePromptState>('guide-image-prompt')],

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

  created() {
    this.loadInitialState(this.encodedSelectedFood.id, this.promptId, {
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
    });
  },

  mounted() {
    this.setValidationState(this.isValid(this.initialState));
  },

  computed: {
    ...mapState(useSurvey, [
      'currentTempPromptAnswer',
      'selectedFood',
      'selectedMealIndex',
      'selectedFoodIndex',
    ]),

    parameters(): GuideImageParameters {
      if (this.selectedPortionSize.method !== 'guide-image')
        throw new Error('Selected portion size method must be "guide-image"');

      return this.selectedPortionSize.parameters as unknown as GuideImageParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    isValid(state: GuideImagePromptState | null): boolean {
      if (state === null) return false;
      return state.objectIdx !== undefined && state.objectConfirmed && state.quantityConfirmed;
    },

    onUpdate(newState: GuideImagePromptState) {
      this.updateStoredState(this.encodedSelectedFood.id, this.promptId, newState);
      this.setValidationState(this.isValid(newState));
    },

    commitAnswer() {
      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (
        mealIndex === undefined ||
        foodIndex === undefined ||
        this.initialStateInternal?.portionSize == null
      ) {
        console.warn(
          'No selected meal/food, meal/food index undefined or portionSixe method is not set',
          mealIndex,
          foodIndex,
          this.initialStateInternal
        );
        return;
      }
      this.updateFood({
        mealIndex,
        foodIndex,
        food: {
          portionSize: this.initialStateInternal.portionSize,
        },
      });
      this.clearStoredState(this.selectedFoodIndexRequired, this.promptId);
    },
  },
});
</script>
