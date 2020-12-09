import { AnyDictionary, LocaleTranslation } from './common';

export interface BasePromptProps {
  text: LocaleTranslation;
  description: LocaleTranslation;
}

export interface ValidatedPromptProps extends BasePromptProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

export type DatePickerPromptProps = ValidatedPromptProps;

export interface TimePickerPromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface TextareaPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  hint: LocaleTranslation;
}

export type ListOption = {
  id?: number;
  label: string;
  value: string;
};

export type LocaleOptionList = { [locale: string]: ListOption[] };

export type RadioOrientation = 'column' | 'row';

export interface RadioListPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  options: LocaleOptionList;
  orientation: RadioOrientation;
  other: boolean;
}

export interface CheckboxListPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  options: LocaleOptionList;
  other: boolean;
}

export interface PortionSizeOptionPromptProps {
  // Prop for which methods to display
  // Get list of method types that are allowed
  methods: string;  // Temporary
};

export type ComponentType =
  | 'info-prompt'
  | 'date-picker-prompt'
  | 'time-picker-prompt'
  | 'checkbox-list-prompt'
  | 'radio-list-prompt'
  | 'textarea-prompt'
  | 'submit-prompt';

export interface PromptQuestion<T = AnyDictionary> {
  id: string;
  name: string;
  component: ComponentType;
  props: T;
}
