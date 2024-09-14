import type { ComponentType } from '@intake24/common/prompts';
import type { MealSection, PromptSection } from '@intake24/common/surveys';

export { default as customPrompts } from './custom';
export { default as portionSizePrompts } from './portion-size';
export { default as standardPrompts } from './standard';

const baseTabs = ['general', 'content', 'actions', 'conditions'];
const tabs = [...baseTabs, 'options', 'json'];
const tabsWithValidation = [...baseTabs, 'validation', 'options', 'json'];

export const promptSections: PromptSection[] = [
  'preMeals',
  'preFoods',
  'foods',
  'postFoods',
  'postMeals',
  'submission',
];

export const promptSectionsExceptSubmission: PromptSection[] = [
  'preMeals',
  'preFoods',
  'foods',
  'postFoods',
  'postMeals',
];

export const foodsAndMeals: MealSection[] = ['foods', 'preFoods', 'postFoods'];

export type PromptSettingsRecord = {
  tabs: string[];
  sections: PromptSection[];
};

export type PromptSettings = Record<ComponentType, PromptSettingsRecord>;

export const promptSettings: PromptSettings = {
  // Custom
  'checkbox-list-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'date-picker-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'info-prompt': {
    tabs: [...tabs],
    sections: [...promptSectionsExceptSubmission],
  },
  'multi-prompt': {
    tabs: [],
    sections: [],
  },
  'no-more-information-prompt': {
    tabs: [...tabs],
    sections: [...foodsAndMeals],
  },
  'select-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'slider-prompt': {
    tabs: [...tabs],
    sections: [...promptSectionsExceptSubmission],
  },
  'radio-list-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'textarea-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'time-picker-prompt': {
    tabs: [...tabsWithValidation],
    sections: [...promptSectionsExceptSubmission],
  },
  'yes-no-prompt': {
    tabs: [...tabs],
    sections: [...promptSectionsExceptSubmission],
  },
  'aggregate-choice-prompt': {
    tabs: [...tabs],
    sections: ['postMeals'],
  },
  // Standard
  'addon-foods-prompt': {
    tabs: [...tabs],
    sections: ['foods', 'postFoods', 'postMeals'],
  },
  'associated-foods-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'general-associated-foods-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'edit-meal-prompt': {
    tabs: [...tabs],
    sections: ['preFoods'],
  },
  'external-source-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'final-prompt': {
    tabs: [...tabs],
    sections: ['submission'],
  },
  'food-search-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'meal-add-prompt': {
    tabs: [...tabs],
    sections: ['preMeals'],
  },
  'meal-duration-prompt': {
    tabs: [...tabs],
    sections: ['preFoods', 'postFoods'],
  },
  'meal-gap-prompt': {
    tabs: [...tabs],
    sections: ['postMeals'],
  },
  'meal-time-prompt': {
    tabs: [...tabs],
    sections: ['preFoods'],
  },
  'ready-meal-prompt': {
    tabs: [...tabs],
    sections: ['postFoods'],
  },
  'recall-date-prompt': {
    tabs: [...tabs],
    sections: ['preMeals'],
  },
  'redirect-prompt': {
    tabs: [...tabs],
    sections: ['submission'],
  },
  'review-confirm-prompt': {
    tabs: [...tabs],
    sections: ['submission'],
  },
  'same-as-before-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'split-food-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'submit-prompt': {
    tabs: [...tabs],
    sections: ['submission'],
  },
  // Portion size
  'as-served-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'cereal-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'direct-weight-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'drink-scale-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'guide-image-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'milk-in-a-hot-drink-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'milk-on-cereal-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'missing-food-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'parent-food-portion-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'pizza-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'pizza-v2-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'portion-size-option-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'recipe-builder-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
  'standard-portion-prompt': {
    tabs: [...tabs],
    sections: ['foods'],
  },
};
