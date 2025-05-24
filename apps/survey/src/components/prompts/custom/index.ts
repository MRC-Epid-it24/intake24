import CheckboxListPrompt from './checkbox-list-prompt.vue';
import DatePickerPrompt from './date-picker-prompt.vue';
import FoodSelectionPrompt from './food-selection/food-selection-prompt.vue';
import InfoPrompt from './info-prompt.vue';
import NoMoreInformationPrompt from './no-more-information-prompt.vue';
import RadioListPrompt from './radio-list-prompt.vue';
import SelectPrompt from './select-prompt.vue';
import SliderPrompt from './slider-prompt.vue';
import TextareaPrompt from './textarea-prompt.vue';
import TimePickerPrompt from './time-picker-prompt.vue';
import YesNoPrompt from './yes-no-prompt.vue';

export { default as AggregateChoicePrompt } from './aggregate-choice-prompt.vue';
export * from './food-selection';

export const customPrompts = {
  CheckboxListPrompt,
  DatePickerPrompt,
  InfoPrompt,
  FoodSelectionPrompt,
  NoMoreInformationPrompt,
  SelectPrompt,
  SliderPrompt,
  RadioListPrompt,
  TextareaPrompt,
  TimePickerPrompt,
  YesNoPrompt,
};
export type CustomPrompts = typeof customPrompts[keyof typeof customPrompts];
