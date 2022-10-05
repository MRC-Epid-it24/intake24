import { copy } from '@intake24/common/util';

import type { LocaleTranslation } from '../../types';
import type { PromptQuestion } from '..';
import type {
  BasePromptProps,
  LocaleOptionList,
  RadioOrientation,
  ValidatedPromptProps,
} from './base';
import { promptValidation } from './base';

export type DatePickerPromptProps = ValidatedPromptProps;

export interface TimePickerPromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface TextareaPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  hint: LocaleTranslation;
}

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

export const baseCustomPromptProps: BasePromptProps = {
  name: { en: 'Enter name' },
  text: { en: 'Enter text' },
  description: { en: 'Enter description' },
  conditions: [],
};

export const infoPromptProps: InfoPromptProps = copy({
  ...baseCustomPromptProps,
  name: { en: 'Info / confirmation' },
});

export const yesNoPromptProps: YesNoPromptProps = copy({
  ...baseCustomPromptProps,
  name: { en: 'Yes / No confirmation' },
});

export const datePickerPromptProps: DatePickerPromptProps = copy({
  ...baseCustomPromptProps,
  ...promptValidation,
  name: { en: 'Pick Date' },
});

export const timePickerPromptProps: TimePickerPromptProps = copy({
  ...baseCustomPromptProps,
  ...promptValidation,
  name: { en: 'Pick Time' },
  format: '24hr',
});

export const checkboxListPromptProps: CheckboxListPromptProps = copy({
  ...baseCustomPromptProps,
  ...promptValidation,
  name: { en: 'Checkbox List' },
  label: {},
  options: { en: [] },
  other: false,
});

export const radioListPromptProps: RadioListPromptProps = copy({
  ...baseCustomPromptProps,
  ...promptValidation,
  name: { en: 'Radio List' },
  label: {},
  options: { en: [] },
  orientation: 'column',
  other: false,
});

export const textareaPromptProps: TextareaPromptProps = copy({
  ...baseCustomPromptProps,
  ...promptValidation,
  name: { en: 'Fill Text' },
  label: {},
  hint: {},
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
