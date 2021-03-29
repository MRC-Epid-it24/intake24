import clone from 'lodash/cloneDeep';
import type { LocaleTranslation, PromptQuestion } from '../../types';
import { basePromptProps, BasePromptProps, promptValidation, ValidatedPromptProps } from './base';

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

export const infoPromptProps: BasePromptProps = clone(basePromptProps);

export const submitPromptProps: BasePromptProps = clone(basePromptProps);

export const datePickerPromptProps: DatePickerPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
});

export const timePickerPromptProps: TimePickerPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
});

export const checkboxListPromptProps: CheckboxListPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  options: { en: [] },
  other: false,
});

export const radioListPromptProps: RadioListPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  options: { en: [] },
  orientation: 'column',
  other: false,
});

export const textareaPromptProps: TextareaPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  hint: { en: null },
});

export const genericPromptQuestions: PromptQuestion[] = [
  {
    component: 'info-prompt',
    id: 'info-prompt',
    name: 'Info / confirmation prompt',
    props: clone(basePromptProps),
  },
  {
    component: 'submit-prompt',
    id: 'submit-prompt',
    name: 'Submit prompt',
    props: clone(basePromptProps),
  },
  {
    component: 'date-picker-prompt',
    id: 'date-picker-prompt',
    name: 'Date picker prompt',
    props: clone(datePickerPromptProps),
  },
  {
    component: 'time-picker-prompt',
    id: 'time-picker-prompt',
    name: 'Time picker prompt',
    props: clone(timePickerPromptProps),
  },
  {
    component: 'checkbox-list-prompt',
    id: 'checkbox-list-prompt',
    name: 'Checkbox List Prompt',
    props: clone(checkboxListPromptProps),
  },
  {
    component: 'radio-list-prompt',
    id: 'radio-list-prompt',
    name: 'Radio List Prompt',
    props: clone(radioListPromptProps),
  },
  {
    component: 'textarea-prompt',
    id: 'textarea-prompt',
    name: 'Textarea prompt',
    props: clone(textareaPromptProps),
  },
];
