import { LGraphNode } from 'litegraph.js';

import type { MealState } from '@intake24/common/types';
import { portionSizeComplete } from '@intake24/common/util/portion-size-checks';

export class MealProgressNode extends LGraphNode {
  static title = 'Progress';
  constructor() {
    super();

    this.title = 'Meal progress';

    this.addInput('Meal', 'meal');
    this.addOutput('Quick list complete', 'boolean');
    this.addOutput('Identification complete', 'boolean');
    this.addOutput('Portion size complete', 'boolean');
  }

  onExecute() {
    const inputMeal = this.getInputData<MealState | undefined>(0);

    if (inputMeal !== undefined) {
      this.setOutputData(0, inputMeal.flags.includes('free-entry-complete'));
      this.setOutputData(1, inputMeal.foods.every(food => food.type !== 'free-text'));
      this.setOutputData(2, inputMeal.foods.every(food => portionSizeComplete(food)));
    }
  }
}

export class MealCustomPromptAnswerNode extends LGraphNode {
  static title = 'Custom prompt answer';

  constructor() {
    super();

    this.title = 'Custom prompt answer';

    this.addInput('Meal', 'meal');
    this.addProperty('promptId', '', 'string');
    this.addWidget('text', 'Prompt ID', this.properties.promptId, 'promptId');
    this.addOutput('Value', 'any');
  }

  onExecute() {
    const inMeal = this.getInputData<MealState | undefined>(0);

    if (inMeal !== undefined) {
      this.setOutputData(0, inMeal.customPromptAnswers[this.properties.promptId]);
    }
    else {
      this.setOutputData(0, undefined);
    }
  }
}
