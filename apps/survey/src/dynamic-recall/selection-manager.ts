import type { SurveyStore } from '../stores';
import type { Selection } from '@intake24/common/surveys';
import type PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';

import { getFoodIndexRequired, getMealIndexRequired } from '@intake24/survey/util';

function makeMealSelection(mealId: string): Selection {
  return {
    element: { type: 'meal', mealId },
    mode: 'auto',
  };
}

function makeFoodSelection(foodId: string): Selection {
  return {
    element: { type: 'food', foodId },
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

  private mealPromptsAvailable(mealId: string, withSelection: Selection): boolean {
    return !!(
      this.promptManager.nextMealSectionPrompt('preFoods', mealId, withSelection)
      || this.promptManager.nextMealSectionPrompt('postFoods', mealId, withSelection)
    );
  }

  private selectMealIfPromptsAvailable(mealId: string): Selection | undefined {
    const selection = makeMealSelection(mealId);
    return this.mealPromptsAvailable(mealId, selection) ? selection : undefined;
  }

  private foodPromptsAvailable(foodId: string, forSelection: Selection): boolean {
    return this.promptManager.nextFoodsPrompt(foodId, forSelection) !== undefined;
  }

  private selectFoodIfPromptsAvailable(foodId: string): Selection | undefined {
    const selection = makeFoodSelection(foodId);
    return this.foodPromptsAvailable(foodId, selection) ? selection : undefined;
  }

  public tryAnyFoodInMeal(mealId: string): Selection | undefined {
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
        const selection = makeFoodSelection(linkedFoodId);
        if (this.foodPromptsAvailable(linkedFoodId, selection))
          return selection;
      }

      const selection = makeFoodSelection(foodId);
      if (this.foodPromptsAvailable(foodId, selection))
        return selection;
    }

    return undefined;
  }

  private tryAnyFoodInSubsequentMeals(mealId: string): Selection | undefined {
    const meals = this.store.meals;
    const mealIndex = getMealIndexRequired(meals, mealId);

    for (let i = mealIndex + 1; i < meals.length; ++i) {
      const selection = this.tryAnyFoodInMeal(meals[i].id);
      if (selection !== undefined)
        return selection;
    }
  }

  private tryAnyFoodInAnyMeal(): Selection | undefined {
    const meals = this.store.meals;

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
      const selection = this.tryAnyFoodInMeal(meals[mealIndex].id);

      if (selection !== undefined)
        return selection;
    }
    return undefined;
  }

  private tryAnyMeal(): Selection | undefined {
    const meals = this.store.meals;

    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
      const mealId = meals[mealIndex].id;
      const selection = makeMealSelection(mealId);

      if (this.mealPromptsAvailable(mealId, selection))
        return selection;
    }
    return undefined;
  }

  firstAvailableSelection(): Selection {
    return this.tryAnyFoodInAnyMeal() ?? this.tryAnyMeal() ?? { mode: 'auto', element: null };
  }

  trySubsequentLinkedFood(foodId: string): Selection | undefined {
    const meals = this.store.meals;
    const foodIndex = getFoodIndexRequired(meals, foodId);
    const meal = meals[foodIndex.mealIndex];

    if (foodIndex.linkedFoodIndex !== undefined) {
      const parentFood = meal.foods[foodIndex.foodIndex];

      for (let i = foodIndex.linkedFoodIndex + 1; i < parentFood.linkedFoods.length; ++i) {
        const nextLinkedFoodId = parentFood.linkedFoods[i].id;
        const selection = makeFoodSelection(nextLinkedFoodId);
        if (this.foodPromptsAvailable(nextLinkedFoodId, selection))
          return selection;
      }
    }

    return undefined;
  }

  trySubsequentFoodInMeal(foodId: string): Selection | undefined {
    const meals = this.store.meals;
    const foodIndex = getFoodIndexRequired(meals, foodId);
    const meal = meals[foodIndex.mealIndex];

    const nextLinkedOrParentSelection
      = this.trySubsequentLinkedFood(foodId) ?? this.tryParentFood(foodId);

    if (nextLinkedOrParentSelection !== undefined)
      return nextLinkedOrParentSelection;

    for (let i = 0; i < foodIndex.foodIndex + 1; ++i) {
      const nextFood = meal.foods[i];
      const nextFoodId = nextFood.id;

      for (let li = 0; li < nextFood.linkedFoods.length; ++li) {
        const linkedFoodId = nextFood.linkedFoods[li].id;
        const selection = makeFoodSelection(linkedFoodId);
        if (this.foodPromptsAvailable(linkedFoodId, selection))
          return selection;
      }

      const selection = makeFoodSelection(nextFoodId);
      if (this.foodPromptsAvailable(nextFoodId, selection))
        return selection;
    }

    return undefined;
  }

  tryParentFood(foodId: string): Selection | undefined {
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
    }
    else {
      switch (selection.element.type) {
        case 'meal': {
          const mealId = selection.element.mealId;

          return (
            this.tryAnyFoodInMeal(mealId)
            ?? this.tryAnyFoodInSubsequentMeals(mealId)
            ?? this.firstAvailableSelection()
          );
        }

        case 'food': {
          const foodId = selection.element.foodId;
          const mealId
            = this.store.meals[getFoodIndexRequired(this.store.meals, foodId).mealIndex].id;

          return (
            this.trySubsequentFoodInMeal(foodId)
            ?? this.tryAnyFoodInMeal(mealId)
            ?? this.selectMealIfPromptsAvailable(mealId)
            ?? this.tryAnyFoodInSubsequentMeals(mealId)
            ?? this.firstAvailableSelection()
          );
        }
      }
    }
  }
}
