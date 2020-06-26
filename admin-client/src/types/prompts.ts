import { AnyDictionary } from '@/types/common';

export interface PromptQuestion<T = AnyDictionary> {
  id: string;
  name: string;
  component: ComponentType;
  props: T;
}

export type ComponentType =
  | 'info-prompt'
  | 'date-picker-prompt'
  | 'time-picker-prompt'
  | 'checkbox-list-prompt'
  | 'radio-list-prompt'
  | 'textarea-prompt'
  | 'submit-prompt';
