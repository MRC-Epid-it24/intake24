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
import { defineComponent, PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { Meal } from '@intake24/common/types';
import { mapGetters } from 'vuex';
import MealAddPrompt from '@intake24/survey/components/prompts/standard/MealAddPrompt.vue';

export default defineComponent({
  name: 'MealAddPromptHandler',
  components: { MealAddPrompt },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
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
