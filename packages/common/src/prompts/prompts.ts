import type { MealSection, SurveyQuestionSection } from '../schemes';
import type { BasePromptProps } from './props';

export const questionTypes = ['custom', 'standard', 'portion-size'] as const;
export type QuestionType = typeof questionTypes[number];

export const customComponentTypes = [
  'info-prompt',
  'date-picker-prompt',
  'time-picker-prompt',
  'checkbox-list-prompt',
  'no-more-information-prompt',
  'radio-list-prompt',
  'textarea-prompt',
  'yes-no-prompt',
] as const;

export type CustomComponentType = typeof customComponentTypes[number];

export const standardComponentTypes = [
  'associated-foods-prompt',
  'edit-meal-prompt',
  'final-prompt',
  'food-search-prompt',
  'meal-add-prompt',
  'meal-time-prompt',
  'ready-meal-prompt',
  'redirect-prompt',
  'review-confirm-prompt',
  'submit-prompt',
] as const;

export type StandardComponentType = typeof standardComponentTypes[number];

export const portionSizeComponentTypes = [
  'as-served-prompt',
  'cereal-prompt',
  'drink-scale-prompt',
  'guide-image-prompt',
  'milk-in-a-hot-drink-prompt',
  'milk-on-cereal-prompt',
  'pizza-prompt',
  'portion-size-option-prompt',
  'standard-portion-prompt',
] as const;

export type PortionSizeComponentType = typeof portionSizeComponentTypes[number];

export type ComponentType = CustomComponentType | StandardComponentType | PortionSizeComponentType;

export interface PromptQuestion<T extends BasePromptProps = BasePromptProps> {
  id: string;
  name: string;
  type: QuestionType;
  component: ComponentType;
  props: T;
}

export interface PromptQuestionWithSection<T extends BasePromptProps = BasePromptProps>
  extends PromptQuestion<T> {
  section: SurveyQuestionSection | MealSection;
}
