import type { Prompts } from './prompts';

import { copy } from '@intake24/common/util';
import { basePrompt, promptValidation } from './base';

export const checkboxListPrompt: Prompts['checkbox-list-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'checkbox-list-prompt',
  type: 'custom',
  id: 'checkbox-list-prompt',
  name: 'Checkbox List Prompt',
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
  current: null,
  min: null,
  max: null,
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
  options: { en: [] },
  orientation: 'column',
  other: false,
});

export const selectPrompt: Prompts['select-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'select-prompt',
  type: 'custom',
  id: 'select-prompt',
  name: 'Select prompt',
  multiple: false,
  options: { en: [] },
});

export const sliderPrompt: Prompts['slider-prompt'] = copy({
  ...basePrompt,
  component: 'slider-prompt',
  type: 'custom',
  id: 'slider-prompt',
  name: 'Slider prompt',
  slider: {
    type: 'slider',
    current: { value: 50, label: false, size: 75 },
    min: { value: 0, label: false },
    max: { value: 100, label: false },
    step: 1,
    confirm: false,
  },
});

export const textareaPrompt: Prompts['textarea-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'textarea-prompt',
  type: 'custom',
  id: 'textarea-prompt',
  name: 'Textarea prompt',
});

export const timePickerPrompt: Prompts['time-picker-prompt'] = copy({
  ...basePrompt,
  ...promptValidation,
  component: 'time-picker-prompt',
  type: 'custom',
  id: 'time-picker-prompt',
  name: 'Time picker prompt',
  allowedMinutes: 5,
  format: '24hr',
});

export const yesNoPrompt: Prompts['yes-no-prompt'] = copy({
  ...basePrompt,
  component: 'yes-no-prompt',
  type: 'custom',
  id: 'yes-no-prompt',
  name: 'Yes / No prompt',
});

export const customPrompts = [
  checkboxListPrompt,
  datePickerPrompt,
  infoPrompt,
  noMoreInformationPrompt,
  selectPrompt,
  sliderPrompt,
  radioListPrompt,
  textareaPrompt,
  timePickerPrompt,
  yesNoPrompt,
];
