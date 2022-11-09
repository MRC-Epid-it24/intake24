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
import { ReviewConfirmPrompt } from '@intake24/survey/components/prompts/standard';
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
    onMealClick(payload: { mealId: number }) {
      this.$emit('meal-context-menu', payload);
    },
    onFoodClick(payload: { foodId: number }) {
      this.$emit('food-context-menu', payload);
    },
    // Method required and intentionally empty
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async commitAnswer() {},
  },
});
</script>

<style scoped></style>
