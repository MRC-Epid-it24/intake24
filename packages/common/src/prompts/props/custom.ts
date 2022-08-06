import { copy } from '@intake24/common/util';

import type { LocaleTranslation } from '../../types';
import type { PromptQuestion } from '..';
import type { BasePromptProps, ValidatedPromptProps } from './base';
import { basePromptProps, promptValidation } from './base';

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

export type InfoPromptProps = BasePromptProps;
export type YesNoPromptProps = BasePromptProps;

export const infoPromptProps: InfoPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Info / confirmation' },
});

export const yesNoPromptProps: YesNoPromptProps = copy(basePromptProps);

export const datePickerPromptProps: DatePickerPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Pick Date' },
});

export const timePickerPromptProps: TimePickerPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Pick Time' },
  format: '24hr',
});

export const checkboxListPromptProps: CheckboxListPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Checkbox List' },
  label: { en: null },
  options: { en: [] },
  other: false,
});

export const radioListPromptProps: RadioListPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Radio List' },
  label: { en: null },
  options: { en: [] },
  orientation: 'column',
  other: false,
});

export const textareaPromptProps: TextareaPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Fill Text' },
  label: { en: null },
  hint: { en: null },
});

export const customPromptQuestions: PromptQuestion[] = [
  {
    component: 'info-prompt',
    type: 'custom',
    id: 'info-prompt',
    name: 'Info / confirmation prompt',
    props: copy(infoPromptProps),
  },
  {
    component: 'date-picker-prompt',
    type: 'custom',
    id: 'date-picker-prompt',
    name: 'Date picker prompt',
    props: copy(datePickerPromptProps),
  },
  {
    component: 'time-picker-prompt',
    type: 'custom',
    id: 'time-picker-prompt',
    name: 'Time picker prompt',
    props: copy(timePickerPromptProps),
  },
  {
    component: 'checkbox-list-prompt',
    type: 'custom',
    id: 'checkbox-list-prompt',
    name: 'Checkbox List Prompt',
    props: copy(checkboxListPromptProps),
  },
  {
    component: 'radio-list-prompt',
    type: 'custom',
    id: 'radio-list-prompt',
    name: 'Radio List Prompt',
    props: copy(radioListPromptProps),
  },
  {
    component: 'textarea-prompt',
    type: 'custom',
    id: 'textarea-prompt',
    name: 'Textarea prompt',
    props: copy(textareaPromptProps),
  },
  {
    component: 'yes-no-prompt',
    type: 'custom',
    id: 'yes-no-prompt',
    name: 'Yes / No prompt',
    props: copy(yesNoPromptProps),
  },
];
