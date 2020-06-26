import VueI18n from '@/locale';
import {
  BasePromptProps,
  ChechboxListProps,
  DatePickerProps,
  RadioListProps,
  TextareaProps,
  TimePickerProps,
} from '@common/types/promptProps';

export const baseDefaults: BasePromptProps = {
  text: 'Placeholder',
  description: null,
};

export const datePickerDefaults: DatePickerProps = {
  text: 'Placeholder',
  description: null,
  validation: {
    required: false,
    message: VueI18n.t('prompts.datepicker.validation.required') as string,
  },
};

export const timePickerDefaults: TimePickerProps = {
  text: 'Placeholder',
  description: null,
  format: '24hr',
  validation: {
    required: false,
    message: VueI18n.t('prompts.timepicker.validation.required') as string,
  },
};

export const checkboxListDefaults: ChechboxListProps = {
  text: 'Placeholder',
  description: null,
  label: VueI18n.t('prompts.checkbox.label') as string,
  options: [],
  other: false,
  validation: {
    required: false,
    message: VueI18n.t('prompts.checkbox.validation.required') as string,
  },
};

export const radioListDefaults: RadioListProps = {
  text: 'Placeholder',
  description: null,
  label: VueI18n.t('prompts.radio.label') as string,
  options: [],
  orientation: 'column',
  other: false,
  validation: {
    required: false,
    message: VueI18n.t('prompts.radio.validation.required') as string,
  },
};

export const textareaDefaults: TextareaProps = {
  text: 'Placeholder',
  description: null,
  label: VueI18n.t('prompts.textarea.label') as string,
  hint: null,
  validation: {
    required: false,
    message: VueI18n.t('prompts.textarea.validation.required') as string,
  },
};
