import { computed } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

export function requireMeal(meal: MealState | undefined): MealState {
  if (meal === undefined) throw new Error('Expected a meal to be selected');
  return meal;
}

export const useMealPromptUtils = () => {
  const survey = useSurvey();

  const selectedMeal = computed(() => requireMeal(survey.selectedMealOptional));
  const selectedMealOptional = computed(() => survey.selectedMealOptional);

  return { selectedMeal, selectedMealOptional };
};
