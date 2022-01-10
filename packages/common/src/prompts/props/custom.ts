import { copy } from '@intake24/common/util';
import type { LocaleTranslation } from '../../types';
import type { PromptQuestion } from '..';
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

export const infoPromptProps: BasePromptProps = copy(basePromptProps);

export const datePickerPromptProps: DatePickerPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  localName: { en: 'Pick Date' },
});

export const timePickerPromptProps: TimePickerPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  format: '24hr',
  localName: { en: 'Pick Time' },
});

export const checkboxListPromptProps: CheckboxListPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  options: { en: [] },
  other: false,
  localName: { en: 'Checkbox List' },
});

export const radioListPromptProps: RadioListPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  options: { en: [] },
  orientation: 'column',
  other: false,
  localName: { en: 'Radio List' },
});

export const textareaPromptProps: TextareaPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  label: { en: null },
  hint: { en: null },
  localName: { en: 'Fill Text' },
});

export const customPromptQuestions: PromptQuestion[] = [
  {
    component: 'info-prompt',
    type: 'custom',
    id: 'info-prompt',
    name: 'Info / confirmation prompt',
    props: copy({ ...basePromptProps, localName: { en: 'Info / confirmation' } }),
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
];
