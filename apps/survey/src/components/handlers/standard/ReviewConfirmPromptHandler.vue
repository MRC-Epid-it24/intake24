<template>
  <review-confirm-prompt
    v-bind="{ meals, promptComponent, promptProps }"
    @action="action"
    @food-selected="onFoodClick"
    @meal-selected="onMealClick"
  ></review-confirm-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import { ReviewConfirmPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'ReviewConfirmPromptHandler',

  components: { ReviewConfirmPrompt },

  props: {
    promptComponent: {
      type: String as PropType<StandardComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },
  computed: {
    ...mapState(useSurvey, ['meals']),
  },

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    action(type: string) {
      this.$emit('action', type);
    },

    async submit() {
      await this.submitRecall();
      this.$emit('action', 'next');
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
