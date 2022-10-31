import type { ComponentType } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';

export { default as customPrompts } from './custom';
export { default as portionSizePrompts } from './portion-size';
export { default as standardPrompts } from './standard';

const baseTab = ['general', 'content', 'conditions'];
const validatedTab = [...baseTab, 'validation'];
const listTab = [...validatedTab, 'options'];

/* const allSection: (SurveyQuestionSection | MealSection)[] = [
  'preMeals',
  'postMeals',
  'submission',
  'preFoods',
  'foods',
  'postFoods',
]; */

const allExceptSubmission: (SurveyQuestionSection | MealSection)[] = [
  'preMeals',
  'postMeals',
  'preFoods',
  'foods',
  'postFoods',
];

const FoodsAndPostFoods: MealSection[] = ['foods', 'postFoods'];

export type PromptSettingsRecord = {
  tabs: string[];
  sections: (SurveyQuestionSection | MealSection)[];
};

export type PromptSettings = Record<ComponentType, PromptSettingsRecord>;

export const promptSettings: PromptSettings = {
  // Custom
  'info-prompt': {
    tabs: [...baseTab],
    sections: [...allExceptSubmission],
  },
  'date-picker-prompt': {
    tabs: [...validatedTab],
    sections: [...allExceptSubmission],
  },
  'time-picker-prompt': {
    tabs: [...validatedTab],
    sections: [...allExceptSubmission],
  },
  'checkbox-list-prompt': {
    tabs: [...listTab],
    sections: [...allExceptSubmission],
  },
  'radio-list-prompt': {
    tabs: [...listTab],
    sections: [...allExceptSubmission],
  },
  'textarea-prompt': {
    tabs: [...validatedTab],
    sections: [...allExceptSubmission],
  },
  'yes-no-prompt': {
    tabs: [...baseTab],
    sections: [...allExceptSubmission],
  },
  'no-more-information-prompt': {
    tabs: [...baseTab],
    sections: [...FoodsAndPostFoods],
  },
  // Standard
  'associated-foods-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
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
  'meal-time-prompt': {
    tabs: [...baseTab],
    sections: ['preFoods'],
  },
  'submit-prompt': {
    tabs: [...baseTab],
    sections: ['submission'],
  },
  'final-prompt': {
    tabs: [...baseTab],
    sections: ['submission'],
  },
  'review-confirm-prompt': {
    tabs: [...baseTab],
    sections: ['submission'],
  },
  'redirect-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['submission'],
  },
  // Portion size
  'as-served-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['foods'],
  },
  'cereal-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['foods'],
  },
  'drink-scale-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'guide-image-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'milk-in-a-hot-drink-prompt': {
    tabs: [...baseTab, 'options'],
    sections: ['foods'],
  },
  'milk-on-cereal-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'pizza-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'portion-size-option-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
  'standard-portion-prompt': {
    tabs: [...baseTab],
    sections: ['foods'],
  },
};
