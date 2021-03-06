import type { Dictionary } from '.';

export type ComponentType =
  | 'info-prompt'
  | 'date-picker-prompt'
  | 'time-picker-prompt'
  | 'checkbox-list-prompt'
  | 'radio-list-prompt'
  | 'textarea-prompt'
  | 'submit-prompt';

export enum PromptStatuses {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ERROR = 'error',
}

export type PromptStatus = PromptStatuses;

export interface PromptQuestion<T = Dictionary> {
  id: string;
  name: string;
  component: ComponentType;
  props: T;
}

export type PromptAnswer = string | string[] | null;

export interface Prompt<T = Dictionary> {
  question: PromptQuestion<T>;
  answer: PromptAnswer;
  status: PromptStatus;
}
