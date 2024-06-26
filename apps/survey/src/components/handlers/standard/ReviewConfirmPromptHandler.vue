<template>
  <review-confirm-prompt
    v-bind="{ meals, prompt, section }"
    @action="action"
    @food-selected="onFoodClick"
    @meal-selected="onMealClick"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { ReviewConfirmPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'ReviewConfirmPromptHandler',

  components: { ReviewConfirmPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['review-confirm-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action', 'food-context-menu', 'meal-context-menu'],

  computed: {
    ...mapState(useSurvey, ['meals']),
  },

  methods: {
    ...mapActions(useSurvey, ['submitRecall']),

    action(type: string, ...args: [id?: string, params?: object]) {
      this.$emit('action', type, ...args);
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
