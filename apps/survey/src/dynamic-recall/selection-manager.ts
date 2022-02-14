import { Selection } from '@intake24/common/types';
import PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';
import type { SurveyStore } from '../stores';

export default class SelectionManager {
  private store;

  private promptManager;

  constructor(store: SurveyStore, promptManager: PromptManager) {
    this.store = store;
    this.promptManager = promptManager;
  }

  private mealPromptsAvailable(mealIndex: number): boolean {
    return this.promptManager.nextPreFoodsPrompt(this.store.$state, mealIndex) !== undefined;
  }

  private foodPromptsAvailable(mealIndex: number, foodIndex: number): boolean {
    return (
      this.promptManager.nextFoodsPrompt(this.store.$state, mealIndex, foodIndex) !== undefined
    );
  }

  private tryAnyFood(mealIndex: number): Selection | undefined {
    const { currentState } = this.store;

    for (let foodIndex = 0; foodIndex < currentState.meals[mealIndex].foods.length; ++foodIndex) {
      if (this.foodPromptsAvailable(mealIndex, foodIndex))
        return {
          element: {
            type: 'food',
            mealIndex,
            foodIndex,
          },
          mode: 'auto',
        };
    }

    return undefined;
  }

  private tryFoodInAnyMeal(): Selection | undefined {
    const { currentState } = this.store;

    for (let mealIndex = 0; mealIndex < currentState.meals.length; mealIndex++) {
      const selection = this.tryAnyFood(mealIndex);

      if (selection !== undefined) return selection;
    }
    return undefined;
  }

  private tryAnyMeal(): Selection | undefined {
    const { currentState } = this.store;

    for (let mealIndex = 0; mealIndex < currentState.meals.length; mealIndex++) {
      if (this.mealPromptsAvailable(mealIndex))
        return {
          element: {
            type: 'meal',
            mealIndex,
          },
          mode: 'auto',
        };
    }
    return undefined;
  }

  nextSelection(): Selection | undefined {
    return this.tryFoodInAnyMeal() ?? this.tryAnyMeal();
  }
}
