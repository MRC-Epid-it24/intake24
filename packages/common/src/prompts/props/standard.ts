import { copy } from '@intake24/common/util';

import type { PromptQuestion } from '..';
import type { BasePromptProps, ValidatedPromptProps } from './base';
import { basePromptProps, promptValidation } from './base';

export type AssociatedFoodsPromptProps = BasePromptProps;

export interface EvergyValidationPromptProps extends BasePromptProps {
  threshold: number;
}

export type FinalPromptProps = BasePromptProps;

export interface FoodSearchPromptProps extends BasePromptProps {
  allowBrowsing: boolean;
  dualLanguage: boolean;
}

export interface MealTimePromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export type ReadyMealPromptProps = BasePromptProps;

export interface RedirectPromptProps extends BasePromptProps {
  url: string | null;
  identifier: 'userId' | 'username' | 'token' | 'custom';
  timer: number;
}

export type SameAsBeforePromptProps = BasePromptProps;

export type SplitFoodPromptProps = BasePromptProps;

export const associatedFoodsPromptProps: AssociatedFoodsPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Associated foods' },
});

export const editMealPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Edit Meal' },
});

export const finalPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Final page' },
});

export const foodSearchPromptProps: FoodSearchPromptProps = copy({
  ...basePromptProps,
  allowBrowsing: true,
  dualLanguage: false,
  name: { en: 'Search Food' },
});

export const mealTimePromptProps: MealTimePromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
  name: { en: 'Edit Time' },
});

export const mealAddPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Add Meal' },
});

export const readyMealPromptProps: ReadyMealPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Ready meal' },
});

export const redirectPromptProps: RedirectPromptProps = copy({
  ...basePromptProps,
  url: null,
  identifier: 'username',
  timer: 0,
  name: { en: 'Redirect' },
});

export const reviewConfirmPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Review and Confirm' },
});

export const sameAsBeforePromptProps: SameAsBeforePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Same as before' },
});

export const splitFoodPromptProps: SplitFoodPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Split food' },
});

export const submitPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Submit page' },
});

export const standardPromptQuestions: PromptQuestion[] = [
  {
    component: 'associated-foods-prompt',
    type: 'standard',
    id: 'associated-foods-prompt',
    name: 'Associated foods prompt',
    props: copy(associatedFoodsPromptProps),
  },
  {
    component: 'edit-meal-prompt',
    type: 'standard',
    id: 'edit-meal-prompt',
    name: 'Meal Edit prompt',
    props: copy(editMealPromptProps),
  },
  {
    component: 'final-prompt',
    type: 'standard',
    id: 'final-prompt',
    name: 'Final prompt',
    props: copy(finalPromptProps),
  },
  {
    component: 'food-search-prompt',
    type: 'standard',
    id: 'food-search-prompt',
    name: 'Food search prompt',
    props: copy(foodSearchPromptProps),
  },
  {
    component: 'meal-add-prompt',
    type: 'standard',
    id: 'meal-add-prompt',
    name: 'Meal Add prompt',
    props: copy(mealAddPromptProps),
  },
  {
    component: 'meal-time-prompt',
    type: 'standard',
    id: 'meal-time-prompt',
    name: 'Meal Time prompt',
    props: copy(mealTimePromptProps),
  },
  {
    component: 'ready-meal-prompt',
    type: 'standard',
    id: 'ready-meal-prompt',
    name: 'Ready meal prompt',
    props: copy(readyMealPromptProps),
  },
  {
    component: 'redirect-prompt',
    type: 'standard',
    id: 'redirect-prompt',
    name: 'Redirect prompt',
    props: copy(redirectPromptProps),
  },
  {
    component: 'review-confirm-prompt',
    type: 'standard',
    id: 'review-confirm-prompt',
    name: 'Review and Confirm prompt',
    props: copy(reviewConfirmPromptProps),
  },
  {
    component: 'same-as-before-prompt',
    type: 'standard',
    id: 'same-as-before-prompt',
    name: 'Same as before prompt',
    props: copy(sameAsBeforePromptProps),
  },
  {
    component: 'split-food-prompt',
    type: 'standard',
    id: 'split-food-prompt',
    name: 'Split food prompt',
    props: copy(splitFoodPromptProps),
  },
  {
    component: 'submit-prompt',
    type: 'standard',
    id: 'submit-prompt',
    name: 'Submit prompt',
    props: copy(submitPromptProps),
  },
];
