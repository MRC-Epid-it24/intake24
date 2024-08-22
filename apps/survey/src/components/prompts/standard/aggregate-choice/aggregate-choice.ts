import type { AggregateChoicePrompt } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import type { SurveyStore } from '@intake24/survey/stores';
import { evaluateCondition } from '@intake24/survey/dynamic-recall/prompt-manager';
import { flattenFoods } from '@intake24/survey/util/meal-food';

export function filterMealsForAggregateChoicePrompt(surveyStore: SurveyStore, prompt: AggregateChoicePrompt): MealState[] {
  return surveyStore.data.meals.map(meal => ({
    ...meal,
    foods: flattenFoods(meal.foods).filter((food) => {
      if (food.type !== 'encoded-food')
        return false;
      if (prompt.foodFilter !== undefined)
        return evaluateCondition(prompt.foodFilter, surveyStore, meal, food, `aggregate food choice filter (${prompt.id})`);
      else
        return true;
    }),
  })).filter(meal => meal.foods.length > 0);
}
