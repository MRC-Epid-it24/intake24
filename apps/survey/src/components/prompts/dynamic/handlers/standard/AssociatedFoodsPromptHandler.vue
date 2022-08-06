<template>
  <associated-foods-prompt
    v-bind="{
      promptProps,
      promptComponent,
      food: encodedSelectedFood(),
    }"
    :initial-state="initialStateNotNull"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { AssociatedFoodsState, EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserFoodData } from '@intake24/common/types/http';
import FoodPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/food-prompt-utils';
import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';
import { createPromptHandlerStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-store';
import AssociatedFoodsPrompt from '@intake24/survey/components/prompts/standard/AssociatedFoodsPrompt.vue';
import foodSearchService from '@intake24/survey/services/foods.service';
import { useSurvey } from '@intake24/survey/stores';

interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

function initialPromptState(): AssociatedFoodPromptState {
  return {
    confirmed: undefined,
    selectedFood: undefined,
  };
}

export default defineComponent({
  name: 'AssociatedFoodsPromptHandler',

  mixins: [
    createPromptHandlerStoreMixin<AssociatedFoodsState>('associated-foods-prompt'),
    FoodPromptUtils,
    MealPromptUtils,
  ],

  components: { AssociatedFoodsPrompt },

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

  methods: {
    ...mapActions(useSurvey, ['updateFood', 'getNextFoodId']),

    getInitialState(): AssociatedFoodsState {
      return {
        activePrompt: 0,
        prompts: this.encodedSelectedFood().data.associatedFoodPrompts.map(() =>
          initialPromptState()
        ),
      };
    },

    getFoodOrMealId() {
      return this.selectedFood().id;
    },

    isValid(state: AssociatedFoodsState | null): boolean {
      if (state === null) return false;

      return state.prompts.every(
        (prompt) =>
          prompt.confirmed === false ||
          (prompt.confirmed === true && prompt.selectedFood !== undefined)
      );
    },

    async fetchFoodData(headers: FoodHeader[]): Promise<UserFoodData[]> {
      //TODO: Show loading

      return Promise.all(
        headers.map((header) => {
          return foodSearchService.getData('en_GB', header.code);
        })
      );
    },

    async commitAnswer() {
      this.clearStoredState();

      const headers: FoodHeader[] = [];

      this.currentStateNotNull.prompts.forEach((prompt) => {
        if (prompt.confirmed && prompt.selectedFood !== undefined) {
          headers.push(prompt.selectedFood);
        }
      });

      const foodData = await this.fetchFoodData(headers);

      const linkedFoods: EncodedFood[] = foodData.map((data) => {
        return {
          type: 'encoded-food',
          id: this.getNextFoodId(),
          flags: [],
          linkedFoods: [],
          customPromptAnswers: {},
          data,
          portionSizeMethodIndex: null,
          portionSize: null,
          associatedFoodsComplete: false,
        };
      });

      this.updateFood({
        foodId: this.encodedSelectedFood().id,
        update: {
          associatedFoodsComplete: true,
          linkedFoods: linkedFoods,
        },
      });
    },
  },
});
</script>
