import { copy } from '@intake24/common/util';

import type { Prompt, Prompts } from './prompts';
import { basePrompt, promptValidation } from './base';

export const associatedFoodsPrompt: Prompts['associated-foods-prompt'] = copy({
  ...basePrompt,
  component: 'associated-foods-prompt',
  type: 'standard',
  id: 'associated-foods-prompt',
  name: 'Associated foods prompt',
});

export const editMealPrompt: Prompts['edit-meal-prompt'] = copy({
  ...basePrompt,
  component: 'edit-meal-prompt',
  type: 'standard',
  id: 'edit-meal-prompt',
  name: 'Meal Edit prompt',
});

export const finalPrompt: Prompts['final-prompt'] = copy({
  ...basePrompt,
  component: 'final-prompt',
  type: 'standard',
  id: 'final-prompt',
  name: 'Final prompt',
});

export const foodSearchPrompt: Prompts['food-search-prompt'] = copy({
  ...basePrompt,
  component: 'food-search-prompt',
  type: 'standard',
  id: 'food-search-prompt',
  name: 'Food search prompt',
  allowBrowsing: true,
  dualLanguage: false,
});

export const mealAddPrompt: Prompts['meal-add-prompt'] = copy({
  ...basePrompt,
  component: 'meal-add-prompt',
  type: 'standard',
  id: 'meal-add-prompt',
  name: 'Meal Add prompt',
  custom: false,
});

export const mealTimePrompt: Prompts['meal-time-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'meal-time-prompt',
  type: 'standard',
  id: 'meal-time-prompt',
  name: 'Meal Time prompt',
  format: '24hr',
});

export const readyMealPrompt: Prompts['ready-meal-prompt'] = copy({
  ...basePrompt,
  component: 'ready-meal-prompt',
  type: 'standard',
  id: 'ready-meal-prompt',
  name: 'Ready meal prompt',
});

export const redirectPrompt: Prompts['redirect-prompt'] = copy({
  ...basePrompt,
  component: 'redirect-prompt',
  type: 'standard',
  id: 'redirect-prompt',
  name: 'Redirect prompt',
  url: null,
  identifier: 'username',
  timer: 0,
});

export const reviewConfirmPrompt: Prompts['review-confirm-prompt'] = copy({
  ...basePrompt,
  component: 'review-confirm-prompt',
  type: 'standard',
  id: 'review-confirm-prompt',
  name: 'Review and Confirm prompt',
});

export const sameAsBeforePrompt: Prompts['same-as-before-prompt'] = copy({
  ...basePrompt,
  component: 'same-as-before-prompt',
  type: 'standard',
  id: 'same-as-before-prompt',
  name: 'Same as before prompt',
});

export const splitFoodPrompt: Prompts['split-food-prompt'] = copy({
  ...basePrompt,
  component: 'split-food-prompt',
  type: 'standard',
  id: 'split-food-prompt',
  name: 'Split food prompt',
});

export const submitPrompt: Prompts['submit-prompt'] = copy({
  ...basePrompt,
  component: 'submit-prompt',
  type: 'standard',
  id: 'submit-prompt',
  name: 'Submit prompt',
});

export const standardPromptQuestions: Prompt[] = [
  associatedFoodsPrompt,
  editMealPrompt,
  finalPrompt,
  foodSearchPrompt,
  mealAddPrompt,
  mealTimePrompt,
  readyMealPrompt,
  redirectPrompt,
  reviewConfirmPrompt,
  sameAsBeforePrompt,
  splitFoodPrompt,
  submitPrompt,
];