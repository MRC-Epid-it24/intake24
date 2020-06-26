import { AnyDictionary } from './common';

export interface BasePromptProps {
  text: string;
  description: string | null;
}

export interface ValidatedPromptProps extends BasePromptProps {
  validation: {
    required: boolean;
    message: string;
  };
}

export type DatePickerProps = ValidatedPromptProps;

export interface TimePickerProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface TextareaProps extends ValidatedPromptProps {
  label: string | null;
  hint: string | null;
}

export type ListOption = {
  id?: number;
  label: string;
  value: string;
};

export type RadioOrientation = 'column' | 'row';

export interface RadioListProps extends ValidatedPromptProps {
  label: string | null;
  options: ListOption[];
  orientation: RadioOrientation;
  other: boolean;
}

export interface ChechboxListProps extends ValidatedPromptProps {
  label: string | null;
  options: ListOption[];
  other: boolean;
}

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
