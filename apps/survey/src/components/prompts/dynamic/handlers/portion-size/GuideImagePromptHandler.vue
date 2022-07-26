<template>
  <guide-image-prompt
    ref="promptHandleChild"
    v-bind="{ foodName, promptProps, selectedFoodIndex, selectedMealIndex, guideFoods }"
    :guide-image-id="parameters['guide-image-id']"
    :prompt-component="promptComponent"
    :conversionFactor="selectedPortionSize.conversionFactor"
    @guide-image-selected="onAnswer"
    @update="onUpdate"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { useFoodGuideImageState } from '@intake24/survey/stores/guide-image';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { GuideImageEncodedFood } from '@intake24/survey/stores/guide-image';
import type { EncodedFood, GuideImageState } from '@intake24/common/types';
import type { GuideImageParameters } from '@intake24/common/types/http';
import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

export default defineComponent({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

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

    guideFoods(): GuideImageEncodedFood | Record<string, never> {
      if (this.selectedFood === undefined || this.selectedFoodIndex === undefined) {
        console.warn('Expected a meal and a food to be selected');
        return {};
      }

      const storedState = useFoodGuideImageState().foodState[this.selectedFoodIndex];
      if (!storedState) return {};
      return storedState.mealId === this.selectedMealIndex ? storedState : {};
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),
    ...mapActions(useFoodGuideImageState, ['updateFoodState', 'clearFoodState']),

    onUpdate(data: { portionSize: GuideImageState; objectIdx: number; panelOpen: number }) {
      if (
        this.selectedFood == undefined ||
        this.selectedMealIndex === undefined ||
        this.selectedFoodIndex === undefined
      ) {
        console.warn('Expected a food to be selected');
        return;
      }
      if (this.selectedFood.type === 'encoded-food') {
        const inputGuidedFood: EncodedFood = {
          ...this.selectedFood,
          portionSize: data.portionSize,
        };
        this.updateFoodState(
          this.selectedMealIndex,
          this.selectedFoodIndex,
          inputGuidedFood,
          data.objectIdx,
          data.panelOpen
        );
      } else
        console.log(
          'Food is not of correct type. "Encoded-food" required but ',
          this.selectedFood.type,
          ' recieved.'
        );
    },

    onAnswer() {
      this.$emit('complete');
    },

    commitAnswer() {
      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (
        mealIndex === undefined ||
        foodIndex === undefined ||
        this.guideFoods.food.portionSize == null
      ) {
        console.warn(
          'No selected meal/food, meal/food index undefined or portionSixe method is not set'
        );
        return;
      }
      this.updateFood({
        mealIndex,
        foodIndex,
        food: {
          portionSize: this.guideFoods.food.portionSize,
        },
      });
      this.clearFoodState(foodIndex);
    },
  },
});
</script>
