<template>
  <edit-meal-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="foods"
    @finishMeal="onAnswer"
    @abortMeal="onAbort"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import Vue from 'vue';
import EditMealPrompt from '@/components/prompts/standard/EditMealPrompt.vue';
import { BasePromptProps } from '@common/prompts';
import { FoodState } from '@common/types';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'MealAddPromptHandler',
  components: { EditMealPrompt },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  computed: {
    ...mapGetters('survey', ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),

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
    onAnswer(newFoods: FoodState[]) {
      this.$store.commit('survey/setFoods', { mealIndex: this.selectedMealIndex, foods: newFoods });
      this.$emit('complete');
    },

    onAbort() {
      this.$store.commit('survey/deleteMeal', this.selectedMealIndex);
      this.$emit('complete');
    },
  },
});
</script>
