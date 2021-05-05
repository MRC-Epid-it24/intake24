import clone from 'lodash/cloneDeep';
import type { PromptQuestion } from '..';
import { basePromptProps, BasePromptProps, promptValidation, ValidatedPromptProps } from './base';

export interface MealTimePromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface FoodSearchPromptProps extends BasePromptProps {
  allowBrowsing: boolean;
  dualLanguage: boolean;
}

export const mealTimePromptProps: MealTimePromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
});

export const mealAddPromptProps: BasePromptProps = clone(basePromptProps);

export const editMealPromptProps: BasePromptProps = clone(basePromptProps);

export const submitPromptProps: BasePromptProps = clone(basePromptProps);

export const foodSearchPromptProps: FoodSearchPromptProps = clone({
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
    props: clone(mealTimePromptProps),
  },
  {
    component: 'submit-prompt',
    type: 'standard',
    id: 'submit-prompt',
    name: 'Submit prompt',
    props: clone(submitPromptProps),
  },
  {
    component: 'food-search-prompt',
    type: 'standard',
    id: 'food-search-prompt',
    name: 'Food search prompt',
    props: clone(foodSearchPromptProps),
  },
  {
    component: 'meal-add-prompt',
    type: 'standard',
    id: 'meal-add-prompt',
    name: 'Meal Add prompt',
    props: clone(mealAddPromptProps),
  },
  {
    component: 'edit-meal-prompt',
    type: 'standard',
    id: 'edit-meal-prompt',
    name: 'Meal Edit prompt',
    props: clone(editMealPromptProps),
  },
];
