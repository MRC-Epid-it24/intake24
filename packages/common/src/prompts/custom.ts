import { copy } from '@intake24/common/util';

import type { Prompt, Prompts } from './prompts';
import { basePrompt, promptValidation } from './base';

export const checkboxListPrompt: Prompts['checkbox-list-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'checkbox-list-prompt',
  type: 'custom',
  id: 'checkbox-list-prompt',
  name: 'Checkbox List Prompt',
  i18n: {
    ...basePrompt.i18n,
    label: {},
  },
  options: { en: [] },
  other: false,
});

export const datePickerPrompt: Prompts['date-picker-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'date-picker-prompt',
  type: 'custom',
  id: 'date-picker-prompt',
  name: 'Date picker prompt',
  futureDates: false,
});

export const infoPrompt: Prompts['info-prompt'] = copy({
  ...basePrompt,
  component: 'info-prompt',
  type: 'custom',
  id: 'info-prompt',
  name: 'Info / confirmation prompt',
});

export const noMoreInformationPrompt: Prompts['no-more-information-prompt'] = copy({
  ...basePrompt,
  component: 'no-more-information-prompt',
  type: 'custom',
  id: 'no-more-information-prompt',
  name: 'No More Information prompt',
});

export const radioListPrompt: Prompts['radio-list-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'radio-list-prompt',
  type: 'custom',
  id: 'radio-list-prompt',
  name: 'Radio List Prompt',
  i18n: {
    ...basePrompt.i18n,
    label: {},
  },
  options: { en: [] },
  orientation: 'column',
  other: false,
});

export const textareaPrompt: Prompts['textarea-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'textarea-prompt',
  type: 'custom',
  id: 'textarea-prompt',
  name: 'Textarea prompt',
  i18n: {
    ...basePrompt.i18n,
    label: {},
    hint: {},
  },
});

export const timePickerPrompt: Prompts['time-picker-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'time-picker-prompt',
  type: 'custom',
  id: 'time-picker-prompt',
  name: 'Time picker prompt',
  format: '24hr',
});

export const yesNoPrompt: Prompts['yes-no-prompt'] = copy({
  ...basePrompt,
  component: 'yes-no-prompt',
  type: 'custom',
  id: 'yes-no-prompt',
  name: 'Yes / No prompt',
});

export const customPrompts: Prompt[] = [
  checkboxListPrompt,
  datePickerPrompt,
  infoPrompt,
  noMoreInformationPrompt,
  radioListPrompt,
  textareaPrompt,
  timePickerPrompt,
  yesNoPrompt,
];
