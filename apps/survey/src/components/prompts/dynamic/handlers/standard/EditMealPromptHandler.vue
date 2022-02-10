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
import { defineComponent, PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState } from '@intake24/common/types';
import { mapGetters } from 'vuex';
import EditMealPrompt from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';

export default defineComponent({
  name: 'MealAddPromptHandler',

  components: { EditMealPrompt },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
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
