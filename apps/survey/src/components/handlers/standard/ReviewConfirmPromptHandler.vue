<template>
  <review-confirm-prompt
    v-bind="{ meals, promptComponent, promptProps }"
    @food-selected="onFoodClick"
    @meal-selected="onMealClick"
    @nav-action="navAction"
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

    navAction(action: string) {
      this.$emit('nav-action', action);
    },

    async submit() {
      await this.submitRecall();
      this.$emit('nav-action', 'complete');
    },

    onMealClick(payload: { mealId: number }) {
      this.$emit('meal-context-menu', payload);
    },

    onFoodClick(payload: { foodId: number }) {
      this.$emit('food-context-menu', payload);
    },
  },
});
</script>

<style scoped></style>
