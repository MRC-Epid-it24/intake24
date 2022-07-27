<template>
  <edit-meal-prompt
    ref="prompt"
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="initialState.foods"
    :prompt-component="promptComponent"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @delete-meal="onDeleteMeal"
    @update="onUpdate"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import type { EditMealPromptType } from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import EditMealPrompt from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { createPromptStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-store';
import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';

interface EditMealState {
  foods: FoodState[];
}

export default defineComponent({
  name: 'EditMealPromptHandler',

  mixins: [MealPromptUtils, createPromptStoreMixin<EditMealState>('edit-meal-prompt')],

  components: { EditMealPrompt },

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

  setup() {
    const prompt = ref<EditMealPromptType>();

    return { prompt };
  },

  created() {
    const selectedMeal = this.selectedMeal;

    this.loadInitialState(selectedMeal.id, this.promptId, {
      foods: selectedMeal.foods,
    });
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals']),
  },

  mounted() {
    this.setValidationState(this.initialState != null && this.initialState.foods.length > 0);
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),

    onUpdate(foodList: FoodState[]) {
      this.updateStoredState(this.selectedMeal.id, this.promptId, { foods: foodList });
      this.setValidationState(foodList.length > 0);
    },

    onDeleteMeal() {
      this.deleteMeal(this.selectedMeal.id);
      this.clearStoredState(this.selectedMeal.id, this.promptId);
    },

    async commitAnswer() {
      const foods = this.prompt!.foodsDrinks();

      this.setFoods({ mealId: this.selectedMeal.id, foods });
      this.clearStoredState(this.selectedMeal.id, this.promptId);
    },
  },
});
</script>
