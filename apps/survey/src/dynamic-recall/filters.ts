import type { AddonFood, Prompts } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/surveys';
import { evaluateCondition } from '@intake24/survey/dynamic-recall/prompt-manager';
import type { SurveyStore } from '@intake24/survey/stores';
import { flattenFoods } from '@intake24/survey/util/meal-food';

export function filterMealsForAggregateChoicePrompt(surveyStore: SurveyStore, prompt: Prompts['aggregate-choice-prompt']): MealState[] {
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

export function filterFoodsForFoodSelectionPrompt(surveyStore: SurveyStore, meal: MealState, prompt: Prompts['food-selection-prompt']): FoodState[] {
  return meal.foods.filter(food =>
    prompt.foodFilter
      ? evaluateCondition(prompt.foodFilter, surveyStore, meal, food, `food selection filter (${prompt.id})`)
      : true,
  );
}

/* const addonFoodTriggers: Record<AddonFoodTrigger, (food: EncodedFood, prompt: Prompts['addon-foods-prompt']) => boolean> = {
  afp: () => false, // TODO: implement
  any: () => true,
  category: (food: EncodedFood, prompt: Prompts['addon-foods-prompt']) => !!(prompt.trigger.value && food.data.categories.includes(prompt.trigger.value)),
  food: (food: EncodedFood, prompt: Prompts['addon-foods-prompt']) => food.data.code === prompt.trigger.value,
  tag: (food: EncodedFood, prompt: Prompts['addon-foods-prompt']) => !!(prompt.trigger.value && food.data.tags.includes(prompt.trigger.value)),
};

export function addonFoodPromptCheck(prompt: Prompts['addon-foods-prompt']) {
  return (food: FoodState) => food.type === 'encoded-food' && addonFoodTriggers[prompt.trigger.type](food, prompt);
} */

export type AddonFoods = Record<string, Record<string, AddonFood[]>>;

export function filterForAddons(surveyStore: SurveyStore, prompt: Prompts['addon-foods-prompt'], meal?: MealState): AddonFoods {
  const meals = meal ? [meal] : surveyStore.data.meals;
  /* const filtered: AddonFoods = {};

  for (const m of meals) {
    filtered[m.id] = {};

    for (const food of m.foods) {
      if (food.type !== 'encoded-food')
        continue;

      filtered[m.id][food.id] = [];
      for (const addon of prompt.items) {
        if (addon.filter.every(f => evaluateCondition(f, surveyStore, m, food, `addon food filter (${prompt.id})`))) {
          console.log(`Adding addon ${addon.code}: all satisfied ${addon.filter.length}`);
          filtered[m.id][food.id].push(addon.code);
        }
      }
    }
  } */

  return meals.reduce<AddonFoods>((acc, meal) => {
    if (!acc[meal.id])
      acc[meal.id] = {};

    return flattenFoods(meal.foods).reduce<AddonFoods>((acc, food) => {
      if (!acc[meal.id][food.id])
        acc[meal.id][food.id] = [];

      for (const addon of prompt.addons) {
        if (addon.filter.every(condition => evaluateCondition(condition, surveyStore, meal, food, `addon food filter (${prompt.id})`))) {
          console.log(`Addons: (MealId ${meal.id}, FoodId ${food.id}) adding addon ${addon.code}: all satisfied ${addon.filter.length}`);
          acc[meal.id][food.id].push(addon);
        }
      }
      return acc;
    }, acc);
  }, {});
}
