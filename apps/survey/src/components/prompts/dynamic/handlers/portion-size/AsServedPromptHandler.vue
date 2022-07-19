<template>
  <as-served-prompt
    v-bind="{ foodName, promptProps }"
    :as-served-set-id="parameters['serving-image-set']"
    :prompt-component="promptComponent"
    @as-served-serving="onAnswer"
    @as-served-leftovers="onAnswer"
    @tempChanging="onTempChange"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { SelectedAsServedImage, PromptAnswer, FoodState } from '@intake24/common/types';
import type { AsServedParameters } from '@intake24/common/types/http';
import AsServedPrompt from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import FoodPromptUtils from '../mixins/food-prompt-utils';
import { createPromptHandlerMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';

interface PromptState {
  selectedServing: SelectedAsServedImage;
  selectedLeftovers: SelectedAsServedImage | false;
}

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  mixins: [FoodPromptUtils, createPromptHandlerMixin<PromptState>('as-served-prompt')],

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

  computed: {
    ...mapState(useSurvey, ['currentTempPromptAnswer']),

    parameters(): AsServedParameters {
      if (this.selectedPortionSize.method !== 'as-served')
        throw new Error('Selected portion size method must be "as-served"');

      return this.selectedPortionSize.parameters as unknown as AsServedParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, [
      'updateFood',
      'updateFoodCallback',
      'setTempPromptAnswer',
      'clearTempPromptAnswer',
    ]),

    onTempChange(
      tempGuidPromptAnswer: PromptAnswer,
      tempUpdatedGuidPromptAnswer?: Partial<PromptAnswer>
    ) {
      if (tempUpdatedGuidPromptAnswer)
        this.setTempPromptAnswer(tempGuidPromptAnswer, tempUpdatedGuidPromptAnswer);
      else this.setTempPromptAnswer(tempGuidPromptAnswer);
    },

    onAnswer(data: {
      selectedServing: SelectedAsServedImage;
      selectedLeftovers: SelectedAsServedImage | false;
    }) {
      const { conversionFactor } = this.selectedPortionSize;

      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.warn('No selected meal/food, meal/food index undefined');
        return;
      }
      this.updateFoodCallback({
        mealIndex,
        foodIndex,
        update: (state: FoodState) => {
          if (state.type === 'encoded-food') {
            state.portionSize = {
              method: 'as-served',
              serving: data.selectedServing,
              leftovers: data.selectedLeftovers || null,
              servingWeight: data.selectedServing.weight ?? null,
              leftoversWeight: data.selectedLeftovers
                ? data.selectedLeftovers.weight * conversionFactor
                : null,
            };
          }
        },
      });

      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onPartialAnswer(data: SelectedAsServedImage) {
      console.log('Called onPartialAnswer first');
      // if (this.currentTempPromptAnswer?.response)
      //   this.onTempChange(this.currentTempPromptAnswer, { finished: true });
      //this.$refs.promptHandleChild?.partialAnswerHandler();
    },
  },
});
</script>
