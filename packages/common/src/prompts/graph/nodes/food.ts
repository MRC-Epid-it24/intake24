import { type IWidget, LGraphNode } from 'litegraph.js';

import type { FoodState } from '@intake24/common/types';
import { portionSizeComplete } from '@intake24/common/util/portion-size-checks';

export class FoodCustomPromptAnswerNode extends LGraphNode {
  static title = 'Custom prompt answer';

  constructor() {
    super();

    this.title = 'Custom prompt answer';

    this.addInput('Food', 'food');
    this.addProperty('promptId', '', 'string');
    this.addWidget('text', 'Prompt ID', this.properties.promptId, 'promptId');
    this.addOutput('Value', 'any');
  }

  onExecute() {
    const inFood = this.getInputData<FoodState | undefined>(0);

    if (inFood !== undefined) {
      this.setOutputData(0, inFood.customPromptAnswers[this.properties.promptId]);
    }
    else {
      this.setOutputData(0, undefined);
    }
  }
}

export class FoodPortionSizeNode extends LGraphNode {
  static title = 'Portion size';
  constructor() {
    super();

    this.title = 'Food portion size';

    this.addInput('food', 'food');
    this.addOutput('Estimation Complete', 'boolean');
  }

  onExecute() {
    const inputFood = this.getInputData<FoodState | undefined>(0);
    this.setOutputData(0, inputFood !== undefined ? portionSizeComplete(inputFood) : false);
  }
}

export class FoodCategoryNode extends LGraphNode {
  static title = 'Category';

  private widget: IWidget<string>;

  constructor() {
    super();

    this.title = 'Food category';

    this.addInput('Food', 'food');
    this.addInput('Category code', 'string');
    this.widget = this.addWidget('text', 'Code', '');

    this.addOutput('Is in category', 'boolean');
  }

  onExecute() {
    const inputFood = this.getInputData<FoodState | undefined>(0);
    const categoryCode = this.widget.value.length > 0 ? this.widget.value : this.getInputData<string | undefined>(1);

    if (inputFood === undefined || categoryCode === undefined) {
      this.setOutputData(0, false);
    }
    else {
      this.setOutputData(0, inputFood.type === 'encoded-food' && inputFood.data.categories.includes(categoryCode));
    }
  }
}
