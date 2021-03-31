import clone from 'lodash/cloneDeep';
import type { PromptQuestion } from '../../types';
import { basePromptProps, BasePromptProps, promptValidation, ValidatedPromptProps } from './base';

export interface MealTimePromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export const mealTimePromptProps: MealTimePromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
});

export const submitPromptProps: BasePromptProps = clone(basePromptProps);

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
];
