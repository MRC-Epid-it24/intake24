import type { Prompts } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/surveys';
import { evaluateCondition } from '@intake24/survey/dynamic-recall/prompt-manager';
import type { SurveyStore } from '@intake24/survey/stores';

export function filterFoodsForFoodSelectionPrompt(surveyStore: SurveyStore, meal: MealState, prompt: Prompts['food-selection-prompt']): FoodState[] {
  return meal.foods.filter(food =>
    prompt.foodFilter
      ? evaluateCondition(prompt.foodFilter, surveyStore, meal, food, `food selection filter (${prompt.id})`)
      : true,
  );
}

export const foodSelectionNoneUuid = '87e44f3c-b8bd-4d97-826f-cddecdd4f117';
