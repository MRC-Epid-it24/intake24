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
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { MealTimePromptProps } from '@intake24/common/prompts';
import { MealTime } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';

function parseMealTime(time: string): MealTime {
  const parts = time.split(':');
  return {
    hours: parseInt(parts[0], 10),
    minutes: parseInt(parts[1], 10),
  };
}

function mealTimeToString(time: MealTime): string {
  return `${time.hours}:${time.minutes}`;
}

export default Vue.extend({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  props: {
    promptProps: {
      type: Object as () => MealTimePromptProps,
      required: true,
    },
    submitTrigger: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedMealIndex']),

    defaultTime(): string {
      if (this.selectedMeal === undefined) throw new Error('A meal must be selected');

      if (this.selectedMeal.time === undefined)
        return mealTimeToString(this.selectedMeal.defaultTime);

      return mealTimeToString(this.selectedMeal.time);
    },
  },

  methods: {
    onAnswer(mealTime: string) {
      this.$store.commit('survey/setMealTime', {
        mealIndex: this.selectedMealIndex,
        time: parseMealTime(mealTime),
      });
      this.$emit('resetPromptTrigger');
      this.$emit('complete');
    },

    onRemoveMeal() {
      this.$store.commit('survey/deleteMeal', this.selectedMealIndex);
      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
