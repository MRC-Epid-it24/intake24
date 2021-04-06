import { ComponentType } from '@common/prompts';
import { MealSection, QuestionSection } from '@common/types';

const baseTab = ['general', 'content', 'conditions'];
const validatedTab = [...baseTab, 'validation'];
const listTab = [...validatedTab, 'options'];

const allSection: (QuestionSection | MealSection)[] = [
  'preMeals',
  'postMeals',
  'submission',
  'preFoods',
  'foods',
  'postFoods',
];

export type PromptSettingsRecord = {
  tabs: string[];
  sections: (QuestionSection | MealSection)[];
};

export type PromptSettings = Record<ComponentType, PromptSettingsRecord>;

export const promptSettings: PromptSettings = {
  // Custom
  'info-prompt': {
    tabs: [...baseTab],
    sections: [...allSection],
  },
  'date-picker-prompt': {
    tabs: [...validatedTab],
    sections: [...allSection],
  },
  'time-picker-prompt': {
    tabs: [...validatedTab],
    sections: [...allSection],
  },
  'checkbox-list-prompt': {
    tabs: [...listTab],
    sections: [...allSection],
  },
  'radio-list-prompt': {
    tabs: [...listTab],
    sections: [...allSection],
  },
  'textarea-prompt': {
    tabs: [...validatedTab],
    sections: [...allSection],
  },
  // Standard
  'meal-time-prompt': {
    tabs: [...baseTab],
    sections: ['preFoods'],
  },
  'submit-prompt': {
    tabs: [...baseTab],
    sections: ['submission'],
  },
};
