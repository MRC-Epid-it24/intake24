import { LGraphNode } from 'litegraph.js';

import type { FoodState, MealState } from '@intake24/common/types';

export class PromptNode extends LGraphNode {
  static title = 'Prompt';
  constructor() {
    super();

    this.title = 'Prompt';

    this.addInput('Enabled', 'boolean');
    this.addInput('Valid', 'boolean');
  }

  isEnabled(): boolean {
    return this.getInputData(0) ?? false;
  }

  isValid(): boolean {
    return this.getInputData(1) ?? false;
  }
}

export class PromptContextNode extends LGraphNode {
  static title = 'Context';
  constructor() {
    super();

    this.title = 'Context';

    this.addOutput('Current Food', 'food');
    this.addOutput('Current Meal', 'meal');
  }

  setValues(currentFood: FoodState | null, currentMeal: MealState | null) {
    this.setOutputData(0, currentFood);
    this.setOutputData(1, currentMeal);
  }
}
