import { copy } from '@intake24/common/util';
import type { PromptQuestion } from '..';
import { basePromptProps, BasePromptProps, promptValidation, ValidatedPromptProps } from './base';

export interface MealTimePromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface RedirectPromptProps extends BasePromptProps {
  url: string | null;
  identifier: 'userId' | 'username' | 'token' | 'custom';
  timer: number;
}

export interface FoodSearchPromptProps extends BasePromptProps {
  allowBrowsing: boolean;
  dualLanguage: boolean;
}

export const mealTimePromptProps: MealTimePromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
  localName: { en: 'Edit Time' },
});

export const mealAddPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  localName: { en: 'Add Meal' },
});

export const editMealPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  localName: { en: 'Edit Meal' },
});

export const submitPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  localName: { en: 'Submit' },
});

export const reviewConfirmPromptProps: BasePromptProps = copy({
  ...basePromptProps,
  localName: { en: 'Review and Confirm' },
});

export const redirectPromptProps: RedirectPromptProps = copy({
  ...basePromptProps,
  url: null,
  identifier: 'username',
  timer: 0,
  localName: { en: 'Redirect' },
});

export const foodSearchPromptProps: FoodSearchPromptProps = copy({
  ...basePromptProps,
  allowBrowsing: true,
  dualLanguage: false,
  localName: { en: 'Search Food' },
});

export const standardPromptQuestions: PromptQuestion[] = [
  {
    component: 'meal-time-prompt',
    type: 'standard',
    id: 'meal-time-prompt',
    name: 'Meal Time prompt',
    props: copy(mealTimePromptProps),
  },
  {
    component: 'submit-prompt',
    type: 'standard',
    id: 'submit-prompt',
    name: 'Submit prompt',
    props: copy(submitPromptProps),
  },
  {
    component: 'review-confirm-prompt',
    type: 'standard',
    id: 'review-confirm-prompt',
    name: 'Review and Confirm prompt',
    props: copy(reviewConfirmPromptProps),
  },
  {
    component: 'redirect-prompt',
    type: 'standard',
    id: 'redirect-prompt',
    name: 'Redirect prompt',
    props: copy(redirectPromptProps),
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
    component: 'edit-meal-prompt',
    type: 'standard',
    id: 'edit-meal-prompt',
    name: 'Meal Edit prompt',
    props: copy(editMealPromptProps),
  },
];
