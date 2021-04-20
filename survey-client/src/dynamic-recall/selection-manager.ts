import { Store } from 'vuex';
import PromptManager from '@/dynamic-recall/prompt-manager';
import { Selection2 } from '@common/types';

export default class SelectionManager {
  private store: Store<any>;

  private promptManager: PromptManager;

  constructor(store: Store<any>, promptManager: PromptManager) {
    this.store = store;
    this.promptManager = promptManager;
  }

  private mealPromptsAvailable(mealIndex: number): boolean {
    return this.promptManager.nextPreFoodsPrompt(this.store.state.survey, mealIndex) !== undefined;
  }

  private tryAnyMeal(): Selection2 | undefined {
    for (let mealIndex = 0; mealIndex < this.store.state.survey.data.meals.length; mealIndex++) {
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

  nextSelection(): Selection2 | undefined {
    return this.tryAnyMeal();
  }
}
