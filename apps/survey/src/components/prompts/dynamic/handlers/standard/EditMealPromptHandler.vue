<template>
  <edit-meal-prompt
    ref="prompt"
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="foods"
    :prompt-component="promptComponent"
    :v-on="$listeners"
    @delete-meal="onDeleteMeal"
    @update="onUpdate"
    @complete="onCompletion"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState, RecallPromptHandler } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import EditMealPrompt, {
  EditMealPromptMethods,
} from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import {
  createPromptHandlerMixin,
  PromptHandlerUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';

type Refs = {
  $refs: {
    prompt: EditMealPromptMethods;
  };
};

interface PromptState {
  foods: FoodState[];
}

export default (
  Vue as VueConstructor<Vue & RecallPromptHandler & Refs & PromptHandlerUtils<PromptState>>
).extend({
  name: 'MealAddPromptHandler',

  mixins: [createPromptHandlerMixin<PromptState>('edit-meal-prompt')],

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

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),

    foods(): FoodState[] {
      if (this.selectedMeal === undefined) {
        console.warn('Expected a meal to be selected');
        return [];
      }

      const storedState = this.getStoredState(this.selectedMeal.id, this.promptId);
      return storedState?.foods ?? this.selectedMeal.foods;
    },
  },

  mounted() {
    this.$emit('completion-update', this.foods.length > 0);
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),

    onUpdate(foodList: FoodState[]) {
      if (this.selectedMeal === undefined) {
        console.warn('Expected a meal to be selected');
      } else {
        this.updateStoredState(this.selectedMeal.id, this.promptId, { foods: foodList });
        this.$emit('completion-update', foodList.length > 0);
      }
    },

    onDeleteMeal() {
      if (this.selectedMealIndex === undefined || this.selectedMeal === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.clearStoredState(this.selectedMeal.id, this.promptId);
    },

    commitAnswer() {
      const foods = this.$refs.prompt?.foodsDrinks();

      if (this.selectedMealIndex === undefined || this.selectedMeal === undefined) {
        console.warn('No selected meal, meal index undefined');
        return false;
      }

      this.setFoods({ mealIndex: this.selectedMealIndex, foods });
      this.clearStoredState(this.selectedMeal.id, this.promptId);
      return true;
    },

    onCompletion() {
      const commitFoodAndDrinks = this.commitAnswer();
      if (commitFoodAndDrinks) this.$emit('complete');
      else console.log('No Food was commited as an Answer: ', commitFoodAndDrinks);
    },
  },
});
</script>
