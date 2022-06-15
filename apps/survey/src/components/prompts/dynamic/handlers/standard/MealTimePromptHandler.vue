<template>
  <meal-time-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :initial-time="initialTime"
    v-on="$listeners"
    @update="onUpdate"
    @remove-meal="onRemoveMeal"
  ></meal-time-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import type { PropType } from '@vue/composition-api';
import { mapActions, mapState } from 'pinia';
import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealTime, RecallPromptHandler } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { parseMealTime } from '@intake24/survey/dynamic-recall/dynamic-recall';

const mealTimeToString = (time: MealTime): string => `${time.hours}:${time.minutes}`;

export default (Vue as VueConstructor<Vue & RecallPromptHandler>).extend({
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

  data() {
    const store = useSurvey();

    if (!store.selectedMeal) throw new Error('A meal must be selected');

    const initialTime = store.selectedMeal.time
      ? mealTimeToString(store.selectedMeal.time)
      : mealTimeToString(store.selectedMeal.defaultTime);

    return {
      initialTime,
      currentTime: initialTime,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex', 'selectedFoodIndex']),
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    onUpdate(mealTime: string) {
      this.currentTime = mealTime;
    },

    onRemoveMeal() {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.$emit('complete');
    },

    commitAnswer() {
      if (this.selectedMealIndex === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }
      this.setMealTime({
        mealIndex: this.selectedMealIndex,
        time: parseMealTime(this.currentTime),
      });
    },
  },
});
</script>

<style scoped></style>
