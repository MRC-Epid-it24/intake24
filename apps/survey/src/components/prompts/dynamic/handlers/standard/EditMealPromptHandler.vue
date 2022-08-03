<template>
  <edit-meal-prompt
    ref="prompt"
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="initialState.foods || []"
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
import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';
import { createPromptHandlerStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-store';

interface EditMealState {
  foods: FoodState[];
}

export default defineComponent({
  name: 'EditMealPromptHandler',

  mixins: [MealPromptUtils, createPromptHandlerStoreMixin<EditMealState>('edit-meal-prompt')],

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

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals']),
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),

    getInitialState(): EditMealState {
      return {
        foods: this.selectedMeal.foods,
      };
    },

    getFoodOrMealId(): number {
      return this.selectedMeal.id;
    },

    isValid(state: EditMealState | null) {
      return state != null && state.foods.length > 0;
    },

    onDeleteMeal() {
      this.deleteMeal(this.selectedMeal.id);
      this.clearStoredState();
    },

    async commitAnswer() {
      const foods = this.prompt!.foodsDrinks();

      this.setFoods({ mealId: this.selectedMeal.id, foods });
      this.clearStoredState();
    },
  },
});
</script>
