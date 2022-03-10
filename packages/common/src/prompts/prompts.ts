import type { MealSection, SurveyQuestionSection } from '../schemes';
import type { BasePromptProps } from './props';

export const questionTypes = ['custom', 'standard', 'portion-size'] as const;
export type QuestionType = typeof questionTypes[number];

export const customComponentTypes = [
  'info-prompt',
  'date-picker-prompt',
  'time-picker-prompt',
  'checkbox-list-prompt',
  'radio-list-prompt',
  'textarea-prompt',
  'yes-no-prompt',
] as const;

export type CustomComponentType = typeof customComponentTypes[number];

export const standardComponentTypes = [
  'meal-time-prompt',
  'submit-prompt',
  'redirect-prompt',
  'food-search-prompt',
  'meal-add-prompt',
  'edit-meal-prompt',
] as const;

export type StandardComponentType = typeof standardComponentTypes[number];

export const portionSizeComponentTypes = [
  'portion-size-option-prompt',
  'as-served-prompt',
  'as-served-leftovers-prompt',
  'guide-image-prompt',
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

export interface QuantityValues {
  whole: number;
  fraction: number;
}

export interface DisplayAssocPromptControl {
  '0': boolean;
  '1': boolean;
}
export interface ToggleAnswersStyle {
  leftover: boolean | null;
  assoc1: boolean | null;
  assoc2: boolean | null;
}
