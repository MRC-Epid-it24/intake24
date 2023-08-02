import { copy } from '@intake24/common/util';

import type { ImageMap, Prompt, Prompts } from './prompts';
import { basePortionPrompt } from './base';

export const imageMap: ImageMap = {
  labels: false,
  pinchZoom: false,
};

export const asServedPrompt: Prompts['as-served-prompt'] = copy({
  ...basePortionPrompt,
  component: 'as-served-prompt',
  type: 'portion-size',
  id: 'as-served-prompt',
  name: 'As served',
  leftovers: false,
  linkedQuantityCategories: [{ code: 'BREAD' }],
});

export const cerealPrompt: Prompts['cereal-prompt'] = copy({
  ...basePortionPrompt,
  component: 'cereal-prompt',
  type: 'portion-size',
  id: 'cereal-prompt',
  name: 'Cereal',
  imageMap,
  leftovers: false,
});

export const drinkScalePrompt: Prompts['drink-scale-prompt'] = copy({
  ...basePortionPrompt,
  component: 'drink-scale-prompt',
  type: 'portion-size',
  id: 'drink-scale-prompt',
  name: 'Drink Scale',
  imageMap,
  leftovers: false,
  multiple: false,
});

export const guideImagePrompt: Prompts['guide-image-prompt'] = copy({
  ...basePortionPrompt,
  component: 'guide-image-prompt',
  type: 'portion-size',
  id: 'guide-image-prompt',
  name: 'Guide image',
  imageMap,
});

export const milkInAHotDrinkPrompt: Prompts['milk-in-a-hot-drink-prompt'] = copy({
  ...basePortionPrompt,
  component: 'milk-in-a-hot-drink-prompt',
  type: 'portion-size',
  id: 'milk-in-a-hot-drink-prompt',
  name: 'Milk in a hot drink',
  orientation: 'column',
});

export const milkOnCerealPrompt: Prompts['milk-on-cereal-prompt'] = copy({
  ...basePortionPrompt,
  component: 'milk-on-cereal-prompt',
  type: 'portion-size',
  id: 'milk-on-cereal-prompt',
  name: 'Milk on cereal',
  imageMap,
});

export const missingFoodPrompt: Prompts['missing-food-prompt'] = copy({
  ...basePortionPrompt,
  component: 'missing-food-prompt',
  type: 'portion-size',
  id: 'missing-food-prompt',
  name: 'Missing food',
});

export const parentFoodPortionPrompt: Prompts['parent-food-portion-prompt'] = copy({
  ...basePortionPrompt,
  component: 'parent-food-portion-prompt',
  type: 'portion-size',
  id: 'parent-food-portion-prompt',
  name: 'Parent food portion',
  orientation: 'column',
});

export const pizzaPrompt: Prompts['pizza-prompt'] = copy({
  ...basePortionPrompt,
  component: 'pizza-prompt',
  type: 'portion-size',
  id: 'pizza-prompt',
  name: 'Pizza',
  imageMap,
});

export const portionSizeOptionPrompt: Prompts['portion-size-option-prompt'] = copy({
  ...basePortionPrompt,
  component: 'portion-size-option-prompt',
  type: 'portion-size',
  id: 'portion-size-option-prompt',
  name: 'Choose portion size method',
});

export const standardPortionPrompt: Prompts['standard-portion-prompt'] = copy({
  ...basePortionPrompt,
  component: 'standard-portion-prompt',
  type: 'portion-size',
  id: 'standard-portion-prompt',
  name: 'Standard portion',
});

export const directWeightPrompt: Prompts['direct-weight-prompt'] = copy({
  ...basePortionPrompt,
  component: 'direct-weight-prompt',
  type: 'portion-size',
  id: 'direct-weight-prompt',
  name: 'Direct weight',
});

export const portionSizePrompts: Prompt[] = [
  asServedPrompt,
  cerealPrompt,
  directWeightPrompt,
  drinkScalePrompt,
  guideImagePrompt,
  milkInAHotDrinkPrompt,
  milkOnCerealPrompt,
  missingFoodPrompt,
  parentFoodPortionPrompt,
  pizzaPrompt,
  portionSizeOptionPrompt,
  standardPortionPrompt,
];