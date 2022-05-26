import { ComponentType } from '@intake24/common/prompts';
import { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';

export { default as customPrompts } from './custom';
export { default as portionSizePrompts } from './portion-size';
export { default as standardPrompts } from './standard';

const baseTab = ['general', 'content', 'conditions'];
const validatedTab = [...baseTab, 'validation'];
const listTab = [...validatedTab, 'options'];

const allSection: (SurveyQuestionSection | MealSection)[] = [
  'preMeals',
  'postMeals',
  'submission',
  'preFoods',
  'foods',
  'postFoods',
];

export type PromptSettingsRecord = {
  tabs: string[];
  sections: (SurveyQuestionSection | MealSection)[];
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
  'yes-no-prompt': {
    tabs: [...baseTab],
    sections: [...allSection],
  },
  // Standard
  'meal-time-prompt': {
    tabs: [...baseTab],
    sections: ['preFoods'],
  },
  'submit-prompt': {
    tabs: [...baseTab],
    // sections: ['submission'],
    sections: [...allSection],
  },
  'review-confirm-prompt': {
    tabs: [...baseTab],
    sections: ['submission'],
  },
  'redirect-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['submission'],
  },
  'food-search-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['foods'],
  },
  'meal-add-prompt': {
    tabs: [...baseTab],
    sections: ['preMeals'],
  },
  'edit-meal-prompt': {
    tabs: [...baseTab],
    sections: ['preFoods'],
  },
  // Portion size
  'portion-size-option-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'as-served-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'as-served-leftovers-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'guide-image-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'drink-scale-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'drinkware-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'standard-portion-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
};
