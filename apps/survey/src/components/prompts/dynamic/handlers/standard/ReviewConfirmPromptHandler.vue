<template>
  <review-confirm-prompt
    :prompt-props="promptProps"
    :prompt-component="promptComponent"
    :meals="meals"
    @meal-selected="onMealClick"
    @food-selected="onFoodClick"
  ></review-confirm-prompt>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import ReviewConfirmPrompt from '@intake24/survey/components/prompts/standard/ReviewConfirmPrompt.vue';
import { mapActions, mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { FoodState } from '@intake24/common/types';

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
    onMealClick(payload: { mealIndex: number; name: string; foods: FoodState[]; entity: 'meal' }) {
      this.$emit('meal-food-selected', payload);
    },
    onFoodClick(payload: { foodIndex: number; mealIndex: number; name: string; entity: 'food' }) {
      this.$emit('meal-food-selected', payload);
    },
  },
});
</script>

<style scoped></style>
