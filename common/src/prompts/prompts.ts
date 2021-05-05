import type { MealSection, SurveyQuestionSection } from '../types';
import type { BasePromptProps } from './props';

export type QuestionType = 'custom' | 'standard' | 'portion-size';

export type CustomComponentType =
  | 'info-prompt'
  | 'date-picker-prompt'
  | 'time-picker-prompt'
  | 'checkbox-list-prompt'
  | 'radio-list-prompt'
  | 'textarea-prompt';

export type StandardComponentType =
  | 'meal-time-prompt'
  | 'submit-prompt'
  | 'food-search-prompt'
  | 'meal-add-prompt'
  | 'edit-meal-prompt';

export type PortionSizeComponentType =
  | 'portion-size-option-prompt'
  | 'as-served-prompt'
  | 'as-served-leftovers-prompt'
  | 'guide-image-prompt'
  | 'standard-portion-prompt';

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
