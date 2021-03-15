import clone from 'lodash/cloneDeep';
import type {
  PromptValidationProps,
  PromptQuestion,
  BasePromptProps,
  CheckboxListPromptProps,
  DatePickerPromptProps,
  RadioListPromptProps,
  TextareaPromptProps,
  TimePickerPromptProps,
  PortionSizeOptionPromptProps,
} from '.';

export const basePromptProps: BasePromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: { en: null },
  },
};

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

// TO DO: migrate this over to portion.ts
export const portionSizeOptionPromptProps: PortionSizeOptionPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  localDescription: { en: null },
  methods: [],
});

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
