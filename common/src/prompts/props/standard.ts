import clone from 'lodash/cloneDeep';
import type { PromptQuestion } from '../../types';
import { basePromptProps, promptValidation, ValidatedPromptProps } from './base';

export interface MealTimePromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export const mealTimePromptProps: MealTimePromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
});

export const standardPromptQuestions: PromptQuestion[] = [
  {
    component: 'meal-time-prompt',
    id: 'meal-time-prompt',
    name: 'Meal Time prompt',
    props: clone(mealTimePromptProps),
  },
];
