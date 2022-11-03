<template>
  <meal-time-prompt
    v-bind="{ promptProps }"
    :initial-time="getInitialState()"
    :meal-name="selectedMeal.name"
    @continue="$emit('continue')"
    @remove-meal="removeMeal"
    @update="onUpdate"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealTime } from '@intake24/common/types';
import {
  createPromptHandlerNoStoreMixin,
  mealPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  mixins: [mealPromptUtils, createPromptHandlerNoStoreMixin<MealTime>()],

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

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    isValid(): boolean {
      return true;
    },

    getInitialState(): MealTime {
      return this.selectedMeal.time ?? this.selectedMeal.defaultTime;
    },

    removeMeal() {
      this.deleteMeal(this.selectedMeal.id);
      this.$emit('complete');
    },

    async commitAnswer() {
      this.setMealTime({
        mealId: this.selectedMeal.id,
        time: this.currentStateNotNull,
      });
    },
  },
});
</script>

<style scoped></style>
