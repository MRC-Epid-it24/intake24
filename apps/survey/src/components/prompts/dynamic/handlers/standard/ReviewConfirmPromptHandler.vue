<template>
  <review-confirm-prompt
    v-bind="{ meals, promptComponent, promptProps }"
    @food-selected="onFoodClick"
    @meal-selected="onMealClick"
  ></review-confirm-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import ReviewConfirmPrompt from '@intake24/survey/components/prompts/standard/ReviewConfirmPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'ReviewConfirmPromptHandler',

  components: { ReviewConfirmPrompt },

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
    ...mapState(useSurvey, ['meals']),
  },

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    async submit() {
      await this.submitRecall();
      this.$emit('complete');
    },
    onMealClick(payload: { mealId: number; name: string; foods: FoodState[]; entity: 'meal' }) {
      this.$emit('meal-food-selected', payload);
    },
    onFoodClick(payload: { foodId: number; name: string; entity: 'food' }) {
      this.$emit('meal-food-selected', payload);
    },
    // Method required and intentionally empty
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async commitAnswer() {},
  },
});
</script>

<style scoped></style>
