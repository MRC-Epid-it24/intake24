<template>
  <edit-meal-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="foods"
    :prompt-component="promptComponent"
    @finishMeal="onAnswer"
    @abortMeal="onAbort"
    @tempChanging="onTempChange"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState, HasOnAnswer, PromptAnswer } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import EditMealPrompt from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default (Vue as VueConstructor<Vue & HasOnAnswer>).extend({
  name: 'MealAddPromptHandler',

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
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),

    // foodsList(): string[] {
    //   if (this.defaultSchemeMeals.length === 0) return [];
    //   return this.defaultSchemeMeals.map((meal: Meal) => meal.name[this.$i18n.locale]);
    // },
    foods(): FoodState[] {
      if (this.selectedMeal === undefined) throw new Error('A meal must be specified');
      return this.selectedMeal.foods;
    },
  },

  methods: {
    ...mapActions(useSurvey, [
      'setFoods',
      'deleteMeal',
      'setTempPromptAnswer',
      'clearTempPromptAnswer',
    ]),

    onTempChange(tempFoodDrinks: PromptAnswer) {
      this.setTempPromptAnswer(tempFoodDrinks);
    },

    onAnswer(newFoods: FoodState[]) {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.setFoods({ mealIndex: this.selectedMealIndex, foods: newFoods });
      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onAbort() {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.$emit('complete');
      this.clearTempPromptAnswer();
    },
  },
});
</script>
