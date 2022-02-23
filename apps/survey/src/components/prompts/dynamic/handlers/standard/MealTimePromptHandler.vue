<template>
  <meal-time-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :submitTrigger="submitTrigger"
    :value="defaultTime"
    :prompt-component="promptComponent"
    @answer="onAnswer"
    @removeMeal="onRemoveMeal"
    @tempChanging="onTempChange"
  ></meal-time-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { mapActions, mapState } from 'pinia';
import { MealTimePromptProps } from '@intake24/common/prompts';
import { MealTime, HasOnAnswer, PromptAnswer } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { parseMealTime } from '@intake24/survey/dynamic-recall/dynamic-recall';

const mealTimeToString = (time: MealTime): string => `${time.hours}:${time.minutes}`;

export default (Vue as VueConstructor<Vue & HasOnAnswer>).extend({
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
    promptComponent: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex', 'currentTempPromptAnswer']),

    defaultTime(): string {
      if (!this.selectedMeal) throw new Error('A meal must be selected');

      if (this.selectedMeal.time) return mealTimeToString(this.selectedMeal.time);

      if (this.currentTempPromptAnswer?.response)
        return this.currentTempPromptAnswer.response.toString();

      return mealTimeToString(this.selectedMeal.defaultTime);
    },
  },

  methods: {
    ...mapActions(useSurvey, [
      'setMealTime',
      'deleteMeal',
      'setTempPromptAnswer',
      'clearTempPromptAnswer',
    ]),

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
      this.clearTempPromptAnswer();
    },

    onRemoveMeal() {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.$emit('complete');
    },

    onTempChange(tempTime: PromptAnswer) {
      this.setTempPromptAnswer(tempTime);
    },
  },
});
</script>

<style scoped></style>
