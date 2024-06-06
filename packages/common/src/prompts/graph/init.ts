import { LiteGraph } from 'litegraph.js';

import { ArrayConstantNode, IsInArrayNode } from './nodes/arrays';
import { FoodCategoryNode, FoodCustomPromptAnswerNode, FoodPortionSizeNode } from './nodes/food';
import { LogicalAndNode } from './nodes/logic';
import { MealProgressNode } from './nodes/meal';
import { PromptContextNode, PromptNode } from './nodes/prompt';

export default function initLiteGraph() {
  LiteGraph.clearRegisteredTypes();
  LiteGraph.registerNodeType('Food/CustomPromptAnswer', FoodCustomPromptAnswerNode);
  LiteGraph.registerNodeType('Food/IsInCategory', FoodCategoryNode);
  LiteGraph.registerNodeType('Food/PortionSize', FoodPortionSizeNode);
  LiteGraph.registerNodeType('Meal/Progress', MealProgressNode);
  LiteGraph.registerNodeType('List/Constant', ArrayConstantNode);
  LiteGraph.registerNodeType('List/IsInList', IsInArrayNode);
  LiteGraph.registerNodeType('Logic/And', LogicalAndNode);
  LiteGraph.registerNodeType('Prompt/Properties', PromptNode);
  LiteGraph.registerNodeType('Prompt/Context', PromptContextNode);
}
