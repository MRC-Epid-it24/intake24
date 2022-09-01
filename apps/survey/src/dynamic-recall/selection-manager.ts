import type { Selection } from '@intake24/common/types';
import type PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';
import {
  getFoodIndexRequired,
  getMealIndexRequired,
} from '@intake24/survey/stores/meal-food-utils';

import type { SurveyStore } from '../stores';

function makeMealSelection(mealId: number): Selection {
  return {
    element: {
      type: 'meal',
      mealId,
    },
    mode: 'auto',
  };
}

function makeFoodSelection(foodId: number): Selection {
  return {
    element: {
      type: 'food',
      foodId,
    },
    mode: 'auto',
  };
}

export default class SelectionManager {
  private store;

  private promptManager;

  constructor(store: SurveyStore, promptManager: PromptManager) {
    this.store = store;
    this.promptManager = promptManager;
  }

  private mealPromptsAvailable(mealId: number): boolean {
    return (
      this.promptManager.nextMealSectionPrompt(this.store.$state, 'preFoods', mealId) !== undefined
    );
  }

  private selectMealIfPromptsAvailable(mealId: number): Selection | undefined {
    return this.mealPromptsAvailable(mealId) ? makeMealSelection(mealId) : undefined;
  }

  private foodPromptsAvailable(foodId: number): boolean {
    return this.promptManager.nextFoodsPrompt(this.store.$state, foodId) !== undefined;
  }

  private selectFoodIfPromptsAvailable(foodId: number): Selection | undefined {
    return this.foodPromptsAvailable(foodId) ? makeFoodSelection(foodId) : undefined;
  }

  public tryAnyFoodInMeal(mealId: number): Selection | undefined {
    const meals = this.store.meals;
    const mealIndex = getMealIndexRequired(meals, mealId);

    for (let foodIndex = 0; foodIndex < meals[mealIndex].foods.length; ++foodIndex) {
      const foodId = meals[mealIndex].foods[foodIndex].id;

      for (
        let linkedFoodIndex = 0;
        linkedFoodIndex < meals[mealIndex].foods[foodIndex].linkedFoods.length;
        ++linkedFoodIndex
      ) {
        const linkedFoodId = meals[mealIndex].foods[foodIndex].linkedFoods[linkedFoodIndex].id;
        if (this.foodPromptsAvailable(linkedFoodId)) return makeFoodSelection(linkedFoodId);
      }

      if (this.foodPromptsAvailable(foodId)) return makeFoodSelection(foodId);
    }

    return undefined;
  }

  private tryAnyFoodInSubsequentMeals(mealId: number): Selection | undefined {
    const meals = this.store.meals;
    const mealIndex = getMealIndexRequired(meals, mealId);

    for (let i = mealIndex + 1; i < meals.length; ++i) {
      const selection = this.tryAnyFoodInMeal(meals[i].id);
      if (selection !== undefined) return selection;
    }
  }

  private tryAnyFoodInAnyMeal(): Selection | undefined {
    const meals = this.store.meals;

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
      const selection = this.tryAnyFoodInMeal(meals[mealIndex].id);

      if (selection !== undefined) return selection;
    }
    return undefined;
  }

  private tryAnyMeal(): Selection | undefined {
    const meals = this.store.meals;

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
      const mealId = meals[mealIndex].id;

      if (this.mealPromptsAvailable(mealId)) return makeMealSelection(mealId);
    }
    return undefined;
  }

  firstAvailableSelection(): Selection {
    return this.tryAnyFoodInAnyMeal() ?? this.tryAnyMeal() ?? { mode: 'auto', element: null };
  }

  trySubsequentLinkedFood(foodId: number): Selection | undefined {
    const meals = this.store.meals;
    const foodIndex = getFoodIndexRequired(meals, foodId);
    const meal = meals[foodIndex.mealIndex];

    if (foodIndex.linkedFoodIndex !== undefined) {
      const parentFood = meal.foods[foodIndex.foodIndex];

      for (let i = foodIndex.linkedFoodIndex + 1; i < parentFood.linkedFoods.length; ++i) {
        const nextLinkedFoodId = parentFood.linkedFoods[i].id;
        if (this.foodPromptsAvailable(nextLinkedFoodId)) return makeFoodSelection(nextLinkedFoodId);
      }
    }

    return undefined;
  }

  trySubsequentFoodInMeal(foodId: number): Selection | undefined {
    const meals = this.store.meals;
    const foodIndex = getFoodIndexRequired(meals, foodId);
    const meal = meals[foodIndex.mealIndex];

    const nextLinkedOrParentSelection =
      this.trySubsequentLinkedFood(foodId) ?? this.tryParentFood(foodId);

    if (nextLinkedOrParentSelection !== undefined) return nextLinkedOrParentSelection;

    for (let i = 0; i < foodIndex.foodIndex + 1; ++i) {
      const nextFood = meal.foods[i];
      const nextFoodId = nextFood.id;

      for (let li = 0; li < nextFood.linkedFoods.length; ++li) {
        const linkedFoodId = nextFood.linkedFoods[li].id;
        if (this.foodPromptsAvailable(linkedFoodId)) return makeFoodSelection(linkedFoodId);
      }

      if (this.foodPromptsAvailable(nextFoodId)) return makeFoodSelection(nextFoodId);
    }
  }

  tryParentFood(foodId: number): Selection | undefined {
    const meals = this.store.meals;
    const foodIndex = getFoodIndexRequired(meals, foodId);
    const meal = meals[foodIndex.mealIndex];

    if (foodIndex.linkedFoodIndex !== undefined) {
      const parentFood = meal.foods[foodIndex.foodIndex];
      return this.selectFoodIfPromptsAvailable(parentFood.id);
    }
  }

  nextSelection(): Selection {
    const selection = this.store.selection;

    if (selection.element === null) {
      return this.firstAvailableSelection();
    } else {
      switch (selection.element.type) {
        case 'meal': {
          const mealId = selection.element.mealId;

          return (
            this.tryAnyFoodInMeal(mealId) ??
            this.tryAnyFoodInSubsequentMeals(mealId) ??
            this.firstAvailableSelection()
          );
        }

        case 'food': {
          const foodId = selection.element.foodId;
          const mealId =
            this.store.meals[getFoodIndexRequired(this.store.meals, foodId).mealIndex].id;

          return (
            this.trySubsequentFoodInMeal(foodId) ??
            this.tryAnyFoodInMeal(mealId) ??
            this.selectMealIfPromptsAvailable(mealId) ??
            this.tryAnyFoodInSubsequentMeals(mealId) ??
            this.firstAvailableSelection()
          );
        }
      }
    }
  }
}
