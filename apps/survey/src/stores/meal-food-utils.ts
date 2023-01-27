import type {
  FoodState,
  MealState,
  MealTime,
  Selection,
  SurveyState,
} from '@intake24/common/types';
import type { FoodIndex, MealFoodIndex } from '@intake24/survey/stores/survey';

export const fromMealTime = (time: MealTime, doubleDigit?: boolean): string => {
  const { hours, minutes } = time;

  if (!doubleDigit) return `${hours}:${minutes}`;

  return [hours, minutes]
    .map((item) => (item.toString().length === 1 ? `0${item}` : item.toString()))
    .join(':');
};

export const toMealTime = (time: string): MealTime => {
  const [hours, minutes] = time.split(':').map((item) => parseInt(item, 10));

  return { hours, minutes };
};

export function getFoodIndexInMeal(meal: MealState, id: number): FoodIndex | undefined {
  for (let i = 0; i < meal.foods.length; ++i) {
    if (meal.foods[i].id === id) return { foodIndex: i, linkedFoodIndex: undefined };

    for (let li = 0; li < meal.foods[i].linkedFoods.length; ++li) {
      if (meal.foods[i].linkedFoods[li].id === id) return { foodIndex: i, linkedFoodIndex: li };
    }
  }

  return undefined;
}

export function getFoodIndex(meals: MealState[], id: number): MealFoodIndex | undefined {
  for (let mi = 0; mi < meals.length; ++mi) {
    const foodIndex = getFoodIndexInMeal(meals[mi], id);

    if (foodIndex !== undefined) return { mealIndex: mi, ...foodIndex };
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

export function foodPortionSizeComplete(food: FoodState) {
  return food.type === 'encoded-food' && food.portionSize !== null;
}

export function associatedFoodPromptsComplete(food: FoodState) {
  return (
    food.type === 'encoded-food' &&
    (food.associatedFoodsComplete || !food.data.associatedFoodPrompts.length)
  );
}

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

  if (element === null) return meals.length ? meals[0].id : undefined;

  return element.type === 'meal'
    ? getMealIndexRequired(meals, element.mealId)
    : getFoodIndexRequired(meals, element.foodId).mealIndex;
}
