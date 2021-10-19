<template>
  <meal-add-prompt
    :prompt-props="promptProps"
    :list="mealsList"
    @addMeal="onAnswer"
    @abortMeal="onAbort"
  >
  </meal-add-prompt>
</template>

<script lang="ts">
import Vue from 'vue';
import { BasePromptProps } from '@common/prompts';
import { Meal } from '@common/types';
import { mapGetters } from 'vuex';
import MealAddPrompt from '@/components/prompts/standard/MealAddPrompt.vue';

export default Vue.extend({
  name: 'MealAddPromptHandler',
  components: { MealAddPrompt },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
  },

  computed: {
    ...mapGetters('survey', ['defaultSchemeMeals']),

    mealsList(): string[] {
      if (this.defaultSchemeMeals.length === 0) return [];
      return this.defaultSchemeMeals.map((meal: Meal) => meal.name[this.$i18n.locale]);
    },
  },

  methods: {
    onAnswer(newMeal: string) {
      this.$store.commit('survey/addMeal', newMeal);
      this.$emit('complete');
    },

    onAbort() {
      this.$emit('complete');
    },
  },
});
</script>
