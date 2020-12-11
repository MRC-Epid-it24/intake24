import clone from 'lodash/cloneDeep';
import { PromptQuestion } from '../types/prompts';
import {
  BasePromptProps,
  CheckboxListPromptProps,
  DatePickerPromptProps,
  RadioListPromptProps,
  TextareaPromptProps,
  TimePickerPromptProps,
  PortionSizeOptionPromptProps,
} from '../types/promptProps';

export const basePromptProps: BasePromptProps = {
  text: { en: null },
  description: { en: null },
};

export const infoPromptProps: BasePromptProps = clone(basePromptProps);

export const submitPromptProps: BasePromptProps = clone(basePromptProps);

export const datePickerPromptProps: DatePickerPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const timePickerPromptProps: TimePickerPromptProps = {
  text: { en: null },
  description: { en: null },
  format: '24hr',
  validation: {
    required: false,
    message: { en: null },
  },
};

export const checkboxListPromptProps: CheckboxListPromptProps = {
  text: { en: null },
  description: { en: null },
  label: { en: null },
  options: { en: [] },
  other: false,
  validation: {
    required: false,
    message: { en: null },
  },
};

export const radioListPromptProps: RadioListPromptProps = {
  text: { en: null },
  description: { en: null },
  label: { en: null },
  options: { en: [] },
  orientation: 'column',
  other: false,
  validation: {
    required: false,
    message: { en: null },
  },
};

export const textareaPromptProps: TextareaPromptProps = {
  text: { en: null },
  description: { en: null },
  label: { en: null },
  hint: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const portionSizeOptionPromptProps: PortionSizeOptionPromptProps = {
  text: { en: null },
  description: { en: null },
  methods: '',
  validation: {
    required: false,
    message: { en: null },
  },
};

export const promptQuestions: PromptQuestion[] = [
  {
    component: 'info-prompt',
    id: 'info-prompt-id',
    name: 'Info / confirmation prompt',
    props: clone(basePromptProps),
  },
  {
    component: 'submit-prompt',
    id: 'submit-prompt-id',
    name: 'Submit prompt',
    props: clone(basePromptProps),
  },
  {
    component: 'date-picker-prompt',
    id: 'date-picker-prompt-id',
    name: 'Date picker prompt',
    props: clone(datePickerPromptProps),
  },
  {
    component: 'time-picker-prompt',
    id: 'time-picker-prompt-id',
    name: 'Time picker prompt',
    props: clone(timePickerPromptProps),
  },
  {
    component: 'checkbox-list-prompt',
    id: 'checkbox-list-prompt-id',
    name: 'Checkbox List Prompt',
    props: clone(checkboxListPromptProps),
  },
  {
    component: 'radio-list-prompt',
    id: 'radio-list-prompt-id',
    name: 'Radio List Prompt',
    props: clone(radioListPromptProps),
  },
  {
    component: 'textarea-prompt',
    id: 'textarea-prompt-id',
    name: 'Textarea prompt',
    props: clone(textareaPromptProps),
  },
];
