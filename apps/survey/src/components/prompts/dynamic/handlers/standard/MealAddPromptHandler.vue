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
import { mapActions, mapState } from 'pinia';
import MealAddPrompt from '@intake24/survey/components/prompts/standard/MealAddPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

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
    ...mapState(useSurvey, ['defaultSchemeMeals']),

    mealsList(): string[] {
      return (
        this.defaultSchemeMeals?.map(
          (meal: Meal) => meal.name[this.$i18n.locale] ?? meal.name.en
        ) ?? []
      );
    },
  },

  methods: {
    ...mapActions(useSurvey, ['addMeal']),

    onAnswer(newMeal: string) {
      this.addMeal(newMeal, this.$i18n.locale);
      this.$emit('complete');
    },

    onAbort() {
      this.$emit('complete');
    },
  },
});
</script>
