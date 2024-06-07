import { LGraphNode } from 'litegraph.js';

import type { FoodState, MealState, SurveyState } from '@intake24/common/types';

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
    this.addOutput('Current Recall', 'recall');
    this.addOutput('Recall Number', 'number');
    this.addOutput('Prompt Answer', 'any');
  }

  setValues(recallNumber: number, survey: SurveyState, currentFood: FoodState | undefined, currentMeal: MealState | undefined) {
    this.setOutputData(0, currentFood);
    this.setOutputData(1, currentMeal);
    this.setOutputData(2, survey);
    this.setOutputData(3, recallNumber);
    this.setOutputData(4, undefined);
  }
}
