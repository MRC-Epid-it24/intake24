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
import { createPromptHandlerMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';
import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';

interface EditMealState {
  foods: FoodState[];
}

export default defineComponent({
  name: 'EditMealPromptHandler',

  mixins: [MealPromptUtils, createPromptHandlerMixin<EditMealState>('edit-meal-prompt')],

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
    this.loadInitialState(this.selectedMealRequired.id, this.promptId, {
      foods: this.selectedMealRequired.foods,
    });
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),
  },

  mounted() {
    this.setValidationState(this.initialState != null && this.initialState.foods.length > 0);
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),

    onUpdate(foodList: FoodState[]) {
      this.updateStoredState(this.selectedMealRequired.id, this.promptId, { foods: foodList });
      this.setValidationState(foodList.length > 0);
    },

    onDeleteMeal() {
      this.deleteMeal(this.selectedMealIndexRequired);
      this.clearStoredState(this.selectedMealRequired.id, this.promptId);
    },

    commitAnswer() {
      const foods = this.prompt!.foodsDrinks();

      this.setFoods({ mealIndex: this.selectedMealIndexRequired, foods });
      this.clearStoredState(this.selectedMealRequired.id, this.promptId);
    },
  },
});
</script>
