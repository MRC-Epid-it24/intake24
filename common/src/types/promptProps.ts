import { AnyDictionary, LocaleTranslation } from './common';
import { PortionSizeMethod } from './models/foods/index'

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

export interface PortionSizeOptionPromptProps extends ValidatedPromptProps {
  // Prop for which methods to display
  methods: PortionSizeMethod;  // Temporary
};

export type ComponentType =
  | 'info-prompt'
  | 'date-picker-prompt'
  | 'time-picker-prompt'
  | 'checkbox-list-prompt'
  | 'radio-list-prompt'
  | 'textarea-prompt'
  | 'submit-prompt'
  | 'portion-size-option-prompt';

export interface PromptQuestion<T = AnyDictionary> {
  id: string;
  name: string;
  component: ComponentType;
  props: T;
}
