<template>
  <meal-time-prompt
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :initial-time="getInitialState()"
    @continue="$emit('continue')"
    @update="onUpdate"
    @remove-meal="onRemoveMeal"
  ></meal-time-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import type { MealTimePromptProps } from '@intake24/common/prompts';
import type { MealTime } from '@intake24/common/types';
import MealTimePrompt from '@intake24/survey/components/prompts/standard/MealTimePrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

import MealPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';
import { createPromptHandlerNoStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-no-store';

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  mixins: [MealPromptUtils, createPromptHandlerNoStoreMixin<MealTime>()],

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

    onRemoveMeal() {
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
