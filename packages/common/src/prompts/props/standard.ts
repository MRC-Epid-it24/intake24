import { copy } from '@common/util';
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
});

export const mealAddPromptProps: BasePromptProps = copy(basePromptProps);

export const editMealPromptProps: BasePromptProps = copy(basePromptProps);

export const submitPromptProps: BasePromptProps = copy(basePromptProps);

export const redirectPromptProps: RedirectPromptProps = copy({
  ...basePromptProps,
  url: null,
  identifier: 'username',
  timer: 0,
});

export const foodSearchPromptProps: FoodSearchPromptProps = copy({
  ...basePromptProps,
  allowBrowsing: true,
  dualLanguage: false,
});

export const standardPromptQuestions: PromptQuestion[] = [
  {
    component: 'meal-time-prompt',
    type: 'standard',
    id: 'meal-time-prompt',
    name: 'Meal Time prompt',
    localName: { en: 'Edit Time' },
    props: copy(mealTimePromptProps),
  },
  {
    component: 'submit-prompt',
    type: 'standard',
    id: 'submit-prompt',
    name: 'Submit prompt',
    localName: { en: 'Submit' },
    props: copy(submitPromptProps),
  },
  {
    component: 'redirect-prompt',
    type: 'standard',
    id: 'redirect-prompt',
    name: 'Redirect prompt',
    localName: { en: 'Redirect' },
    props: copy(redirectPromptProps),
  },
  {
    component: 'food-search-prompt',
    type: 'standard',
    id: 'food-search-prompt',
    name: 'Food search prompt',
    localName: { en: 'Search Food' },
    props: copy(foodSearchPromptProps),
  },
  {
    component: 'meal-add-prompt',
    type: 'standard',
    id: 'meal-add-prompt',
    name: 'Meal Add prompt',
    localName: { en: 'Add Meal' },
    props: copy(mealAddPromptProps),
  },
  {
    component: 'edit-meal-prompt',
    type: 'standard',
    id: 'edit-meal-prompt',
    name: 'Meal Edit prompt',
    localName: { en: 'Edit Meal' },
    props: copy(editMealPromptProps),
  },
];
