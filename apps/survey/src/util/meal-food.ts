import type { FoodState, MealState, Selection, SurveyState } from '@intake24/common/types';
import type { FoodIndex, MealFoodIndex } from '@intake24/survey/stores/survey';
import { randomString } from '@intake24/common/util';

// Helper to generate unique id for each meal/food with same length
export const getEntityId = () => randomString(12);

export function getFoodIndexInMeal(meal: MealState, id: string): FoodIndex | undefined {
  for (let i = 0; i < meal.foods.length; ++i) {
    if (meal.foods[i].id === id) return { foodIndex: i, linkedFoodIndex: undefined };

    for (let li = 0; li < meal.foods[i].linkedFoods.length; ++li) {
      if (meal.foods[i].linkedFoods[li].id === id) return { foodIndex: i, linkedFoodIndex: li };
    }
  }

  return undefined;
}

export function getFoodIndex(meals: MealState[], id: string): MealFoodIndex | undefined {
  for (let mi = 0; mi < meals.length; ++mi) {
    const foodIndex = getFoodIndexInMeal(meals[mi], id);

    if (foodIndex !== undefined) return { mealIndex: mi, ...foodIndex };
  }

  return undefined;
}

export function getMealIndex(meals: MealState[], id: string): number | undefined {
  for (let mi = 0; mi < meals.length; ++mi) {
    if (meals[mi].id === id) return mi;
  }

  return undefined;
}

export function getMealIndexRequired(meals: MealState[], id: string): number {
  const mealIndex = getMealIndex(meals, id);

  if (mealIndex === undefined) throw new Error(`Meal with id ${id} not found`);

  return mealIndex;
}

export function getFoodIndexRequired(meals: MealState[], id: string): MealFoodIndex {
  const foodIndex = getFoodIndex(meals, id);

  if (foodIndex === undefined) throw new Error(`Food with id ${id} not found`);

  return foodIndex;
}

export function getFoodByIndex(meals: MealState[], foodIndex: MealFoodIndex): FoodState {
  return foodIndex.linkedFoodIndex === undefined
    ? meals[foodIndex.mealIndex].foods[foodIndex.foodIndex]
    : meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods[foodIndex.linkedFoodIndex];
}

export function findFood(meals: MealState[], id: string): FoodState {
  const foodIndex = getFoodIndexRequired(meals, id);
  return getFoodByIndex(meals, foodIndex);
}

export function findMeal(meals: MealState[], id: string): MealState {
  const mealIndex = getMealIndexRequired(meals, id);

  return meals[mealIndex];
}

export const foodPortionSizeComplete = (food: FoodState) =>
  food.type === 'encoded-food' && food.portionSize;

export const associatedFoodPromptsComplete = (food: FoodState) =>
  food.type === 'encoded-food' &&
  (food.flags.includes('associated-foods-complete') || !food.data.associatedFoodPrompts.length);

export const encodedFoodComplete = (food: FoodState) =>
  foodPortionSizeComplete(food) && associatedFoodPromptsComplete(food);

export const missingFoodComplete = (food: FoodState) => food.type === 'missing-food' && food.info;

export const foodComplete = (food: FoodState) =>
  encodedFoodComplete(food) || missingFoodComplete(food);

export const mealComplete = (meal: MealState) =>
  !!meal.foods.length && meal.foods.every(foodComplete);

export function mealPortionSizeComplete(meal: MealState) {
  return !!meal.foods.length && meal.foods.every(foodPortionSizeComplete);
}

export function mealAssociatedFoodsComplete(meal: MealState) {
  return !!meal.foods.length && meal.foods.every(associatedFoodPromptsComplete);
}

export function surveyFreeEntryComplete(survey: SurveyState) {
  return (
    !!survey.meals.length &&
    survey.meals.every((meal) => meal.flags.includes('free-entry-complete'))
  );
}

export function getMealIndexForSelection(
  meals: MealState[],
  selection: Selection
): number | undefined {
  const { element } = selection;

  if (element === null) return meals.length ? 0 : undefined;

  return element.type === 'meal'
    ? getMealIndexRequired(meals, element.mealId)
    : getFoodIndexRequired(meals, element.foodId).mealIndex;
}
