<template>
  <meal-time-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :submitTrigger="submitTrigger"
    :value="defaultTime"
    @answer="onAnswer"
    @removeMeal="onRemoveMeal"
  ></meal-time-prompt>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapActions, mapState } from 'pinia';
import { MealTimePromptProps } from '@intake24/common/prompts';
import { MealTime } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { parseMealTime } from '@intake24/survey/dynamic-recall/dynamic-recall';

const mealTimeToString = (time: MealTime): string => `${time.hours}:${time.minutes}`;

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  props: {
    promptProps: {
      type: Object as PropType<MealTimePromptProps>,
      required: true,
    },
    submitTrigger: {
      type: Boolean,
    },
  },

  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex']),

    defaultTime(): string {
      if (!this.selectedMeal) throw new Error('A meal must be selected');

      if (!this.selectedMeal.time) return mealTimeToString(this.selectedMeal.defaultTime);

      return mealTimeToString(this.selectedMeal.time);
    },
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    onAnswer(mealTime: string) {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.setMealTime({
        mealIndex: this.selectedMealIndex,
        time: parseMealTime(mealTime),
      });
      this.$emit('resetPromptTrigger');
      this.$emit('complete');
    },

    onRemoveMeal() {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
