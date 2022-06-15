<template>
  <food-search-prompt
    :prompt-props="promptProps"
    :initial-search-term="selectedFoodDescription"
    @food-selected="onFoodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import type { PropType } from '@vue/composition-api';
import { mapActions, mapState } from 'pinia';
import type { FoodSearchPromptProps } from '@intake24/common/prompts';
import type { FoodState, RecallPromptHandler } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import FoodSearchPrompt from '@intake24/survey/components/prompts/standard/FoodSearchPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import type { VueConstructor } from 'vue';
import Vue from 'vue';

export default (Vue as VueConstructor<Vue & RecallPromptHandler>).extend({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  props: {
    promptProps: {
      type: Object as PropType<FoodSearchPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      foodData: undefined as UserFoodData | undefined,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

    selectedFoodDescription(): string {
      const { selectedFood } = this;

      if (selectedFood === undefined) throw new Error('This prompt requires a food to be selected');

      if (selectedFood.type !== 'free-text')
        throw new Error(
          'This prompt can only be displayed for foods that have not yet been encoded'
        );

      return selectedFood.description;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood', 'getNextFoodId']),

    onFoodSelected(data: UserFoodData) {
      this.foodData = data;
      this.$emit('complete');
    },

    commitAnswer() {
      if (
        this.selectedMealIndex === undefined ||
        this.selectedFoodIndex === undefined ||
        this.selectedFood === undefined
      ) {
        console.warn('No selected food/meal, food/meal index undefined');
        return;
      }

      if (this.foodData === undefined) {
        console.warn('foodData is undefined');
        return;
      }

      const currentState = this.selectedFood;

      // Automatically select the only portion size method available to avoid triggering
      // redundant portion size option prompt
      const portionSizeMethodIndex = this.foodData.portionSizeMethods.length === 1 ? 0 : null;

      const newState: FoodState = {
        id: this.selectedFood.id,
        type: 'encoded-food',
        data: this.foodData,
        portionSizeMethodIndex,
        portionSize: null,
        customPromptAnswers: currentState?.customPromptAnswers ?? {},
        flags: currentState?.flags ?? [],
        linkedFoods: [],
        associatedFoodsComplete: false,
      };

      this.replaceFood({
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        food: newState,
      });
    },
  },
});
</script>

<style scoped></style>
