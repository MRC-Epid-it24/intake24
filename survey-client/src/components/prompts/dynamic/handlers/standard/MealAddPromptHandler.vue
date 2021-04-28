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
import MealAddPrompt from '@/components/prompts/standard/MealAddPrompt.vue';
import { BasePromptProps } from '@common/prompts';
import { MealState2 } from '@common/types';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'MealAddPromptHandler',
  components: { MealAddPrompt },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  computed: {
    ...mapGetters('survey', ['meals']),

    mealsList(): string[] {
      if (this.meals.length === 0) return [];
      return this.meals.map((meal: MealState2) => meal.name);
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
