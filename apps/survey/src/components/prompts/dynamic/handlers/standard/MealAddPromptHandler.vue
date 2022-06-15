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
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { Meal, HasOnAnswer, PromptAnswer } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import MealAddPrompt from '@intake24/survey/components/prompts/standard/MealAddPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default (Vue as VueConstructor<Vue & HasOnAnswer>).extend({
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
    ...mapActions(useSurvey, ['addMeal', 'setTempPromptAnswer', 'clearTempPromptAnswer']),

    onTempChange(tempNewMeal: PromptAnswer) {
      this.setTempPromptAnswer(tempNewMeal);
    },

    onAnswer(newMeal: string) {
      this.addMeal(newMeal, this.$i18n.locale);
      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onPartialAnswer(newMeal: string) {
      console.log('Called onPartialAnswer first');
      this.onAnswer(newMeal);
    },

    onAbort() {
      this.$emit('complete');
      this.clearTempPromptAnswer();
    },
  },
});
</script>
