<template>
  <meal-time-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :initial-time="initialTime"
    @continue="$emit('continue')"
    @update="onUpdate"
    @remove-meal="onRemoveMeal"
  ></meal-time-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealTime } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import { parseMealTime } from '@intake24/survey/dynamic-recall/dynamic-recall';
import { createPromptStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-store';
import MealPromptUtils, {
  requireMeal,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';

const mealTimeToString = (time: MealTime): string => `${time.hours}:${time.minutes}`;

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  mixins: [createPromptStoreMixin<never>('meal-time-prompt'), MealPromptUtils],

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

  mounted() {
    this.setValidationState(true);
  },

  data() {
    const store = useSurvey();
    const selectedMeal = requireMeal(store.selectedMealOptional);

    const initialTime = selectedMeal.time
      ? mealTimeToString(selectedMeal.time)
      : mealTimeToString(selectedMeal.defaultTime);

    return {
      initialTime,
      currentTime: initialTime,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    onUpdate(mealTime: string) {
      this.currentTime = mealTime;
    },

    onRemoveMeal() {
      this.deleteMeal(this.selectedMeal.id);
      this.$emit('complete');
    },

    async commitAnswer() {
      this.setMealTime({
        mealId: this.selectedMeal.id,
        time: parseMealTime(this.currentTime),
      });
    },
  },
});
</script>

<style scoped></style>
