import type { FoodState, MealState, Selection } from '@intake24/common/types';
import type { FoodIndex, MealFoodIndex } from '@intake24/survey/stores/survey';

export function getFoodIndexInMeal(meal: MealState, id: number): FoodIndex | undefined {
  for (let i = 0; i < meal.foods.length; ++i) {
    if (meal.foods[i].id === id)
      return {
        foodIndex: i,
        linkedFoodIndex: undefined,
      };

    for (let li = 0; li < meal.foods[i].linkedFoods.length; ++li) {
      if (meal.foods[i].linkedFoods[li].id === id)
        return {
          foodIndex: i,
          linkedFoodIndex: li,
        };
    }
  }

  return undefined;
}

export function getFoodIndex(meals: MealState[], id: number): MealFoodIndex | undefined {
  for (let mi = 0; mi < meals.length; ++mi) {
    const foodIndex = getFoodIndexInMeal(meals[mi], id);

    if (foodIndex !== undefined)
      return {
        mealIndex: mi,
        ...foodIndex,
      };
  }

  return undefined;
}

export function getMealIndex(meals: MealState[], id: number): number | undefined {
  for (let mi = 0; mi < meals.length; ++mi) {
    if (meals[mi].id === id) return mi;
  }

  return undefined;
}

export function getMealIndexRequired(meals: MealState[], id: number): number {
  const mealIndex = getMealIndex(meals, id);

  if (mealIndex === undefined) throw new Error(`Meal with id ${id} not found`);

  return mealIndex;
}

export function getFoodIndexRequired(meals: MealState[], id: number): MealFoodIndex {
  const foodIndex = getFoodIndex(meals, id);

  if (foodIndex === undefined) throw new Error(`Food with id ${id} not found`);

  return foodIndex;
}

export function getFoodByIndex(meals: MealState[], foodIndex: MealFoodIndex): FoodState {
  return foodIndex.linkedFoodIndex === undefined
    ? meals[foodIndex.mealIndex].foods[foodIndex.foodIndex]
    : meals[foodIndex.mealIndex].foods[foodIndex.foodIndex].linkedFoods[foodIndex.linkedFoodIndex];
}

export function findFood(meals: MealState[], id: number): FoodState {
  const foodIndex = getFoodIndexRequired(meals, id);
  return getFoodByIndex(meals, foodIndex);
}

export function findMeal(meals: MealState[], id: number): MealState {
  const mealIndex = getMealIndexRequired(meals, id);

  return meals[mealIndex];
}

export function getMealIndexForSelection(
  meals: MealState[],
  selection: Selection
): number | undefined {
  const { element } = selection;

  if (element === null) {
    if (meals.length > 0) return meals[0].id;
    return undefined;
  }

  return element.type === 'meal'
    ? getMealIndexRequired(meals, element.mealId)
    : getFoodIndexRequired(meals, element.foodId).mealIndex;
}
