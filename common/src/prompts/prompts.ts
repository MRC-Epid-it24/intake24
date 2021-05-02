import type { BasePromptProps } from './props';

export type GenericComponentType =
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
  | 'as-served-leftovers-prompt';

export type ComponentType = GenericComponentType | StandardComponentType | PortionSizeComponentType;

export enum PromptStatuses {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ERROR = 'error',
}

export type PromptStatus = PromptStatuses;

export interface PromptQuestion<T extends BasePromptProps = BasePromptProps> {
  id: string;
  name: string;
  type: 'custom' | 'standard' | 'portion-size';
  component: ComponentType;
  props: T;
}

export type PromptAnswer = string | string[] | null;

export interface Prompt<T extends BasePromptProps = BasePromptProps> {
  question: PromptQuestion<T>;
  answer: PromptAnswer;
  status: PromptStatus;
}

export interface QuantityValues {
  whole: number;
  fraction: number;
}
