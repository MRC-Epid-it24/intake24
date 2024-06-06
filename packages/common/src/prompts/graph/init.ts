import { LiteGraph } from 'litegraph.js';

import { LogicalOrNode } from '@intake24/common/prompts/graph/nodes/operators';

import { ArrayConstantNode, IsInArrayNode } from './nodes/arrays';
import { FoodCategoryNode, FoodCustomPromptAnswerNode, FoodPortionSizeNode } from './nodes/food';
import { MealCustomPromptAnswerNode, MealProgressNode } from './nodes/meal';
import { EqualsNode, LogicalAndNode } from './nodes/operators';
import { PromptContextNode, PromptNode } from './nodes/prompt';

export default function initLiteGraph() {
  const compareNode = LiteGraph.getNodeType('basic/CompareValues');
  const stringConstantNode = LiteGraph.getNodeType('basic/string');
  const numberConstantNode = LiteGraph.getNodeType('basic/const');

  LiteGraph.clearRegisteredTypes();
  LiteGraph.registerNodeType('Food/CustomPromptAnswer', FoodCustomPromptAnswerNode);
  LiteGraph.registerNodeType('Food/IsInCategory', FoodCategoryNode);
  LiteGraph.registerNodeType('Food/PortionSize', FoodPortionSizeNode);
  LiteGraph.registerNodeType('Meal/Progress', MealProgressNode);
  LiteGraph.registerNodeType('Meal/CustomPromptAnswer', MealCustomPromptAnswerNode);
  LiteGraph.registerNodeType('Constant/List', ArrayConstantNode);
  LiteGraph.registerNodeType('Constant/String', stringConstantNode);
  LiteGraph.registerNodeType('Constant/Number', numberConstantNode);
  LiteGraph.registerNodeType('Operator/And', LogicalAndNode);
  LiteGraph.registerNodeType('Operator/Or', LogicalOrNode);
  LiteGraph.registerNodeType('Operator/Compare Values', compareNode);
  LiteGraph.registerNodeType('Operator/Is In List', IsInArrayNode);
  LiteGraph.registerNodeType('Operator/Equals', EqualsNode);
  LiteGraph.registerNodeType('Prompt/Properties', PromptNode);
  LiteGraph.registerNodeType('Prompt/Context', PromptContextNode);
}
