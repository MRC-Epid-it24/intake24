<template>
  <meal-add-prompt
    :prompt-props="promptProps"
    :prompt-component="promptComponent"
    :list="mealsList"
    @addMeal="onAnswer"
    @abortMeal="onAbort"
    @tempChanging="onTempChange"
  >
  </meal-add-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { Meal, PromptAnswer } from '@intake24/common/types';
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
    promptComponent: {
      type: String,
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

    onTempChange(tempNewMeal: PromptAnswer) {
      // this.setTempPromptAnswer(tempNewMeal);
    },

    onAnswer(newMeal: string) {
      this.addMeal(newMeal, this.$i18n.locale);
      this.$emit('complete');
      // this.clearTempPromptAnswer();
    },

    onPartialAnswer(newMeal: string) {
      console.log('Called onPartialAnswer first');
      this.onAnswer(newMeal);
    },

    onAbort() {
      this.$emit('complete');
      // this.clearTempPromptAnswer();
    },
  },
});
</script>
