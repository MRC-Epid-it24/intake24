import type { MealSection, SurveyQuestionSection } from '../schemes';
import type { LocaleTranslation } from '../types';
import type { Actions } from './actions';
import type { Condition } from './conditions';

export type ListOption<T = string> = {
  id?: number;
  label: string;
  value: T;
};

export type LocaleOptionList<T = string> = {
  en: ListOption<T>[];
  [locale: string]: ListOption<T>[];
};

export type RadioOrientation = 'column' | 'row';

export const promptTypes = ['custom', 'standard', 'portion-size'] as const;
export type PromptType = (typeof promptTypes)[number];

export const customComponentTypes = [
  'info-prompt',
  'date-picker-prompt',
  'time-picker-prompt',
  'checkbox-list-prompt',
  'no-more-information-prompt',
  'radio-list-prompt',
  'textarea-prompt',
  'yes-no-prompt',
] as const;

export type CustomComponentType = (typeof customComponentTypes)[number];

export const standardComponentTypes = [
  'associated-foods-prompt',
  'edit-meal-prompt',
  'final-prompt',
  'food-search-prompt',
  'meal-add-prompt',
  'meal-time-prompt',
  'ready-meal-prompt',
  'redirect-prompt',
  'review-confirm-prompt',
  'same-as-before-prompt',
  'split-food-prompt',
  'submit-prompt',
] as const;

export type StandardComponentType = (typeof standardComponentTypes)[number];

export const portionSizeComponentTypes = [
  'as-served-prompt',
  'cereal-prompt',
  'direct-weight-prompt',
  'drink-scale-prompt',
  'guide-image-prompt',
  'milk-in-a-hot-drink-prompt',
  'milk-on-cereal-prompt',
  'pizza-prompt',
  'portion-size-option-prompt',
  'standard-portion-prompt',
] as const;

export type PortionSizeComponentType = (typeof portionSizeComponentTypes)[number];

export type ComponentType = CustomComponentType | StandardComponentType | PortionSizeComponentType;

export type PromptValidationProps = {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
};

export type BasePrompt = {
  id: string;
  name: string;
  type: PromptType;
  component: ComponentType;
  i18n: {
    name: LocaleTranslation;
    text: LocaleTranslation;
    description: LocaleTranslation;
  } & { [key: string]: LocaleTranslation };
  actions?: Actions;
  conditions: Condition[];
};

export type ValidatedPrompt = BasePrompt & PromptValidationProps;

export interface PromptWithSection extends BasePrompt {
  section: SurveyQuestionSection | MealSection;
}

export type ImageMap = {
  labels: boolean;
  pinchZoom: boolean;
};

export type Prompts = {
  // Custom
  'checkbox-list-prompt': ValidatedPrompt & {
    options: LocaleOptionList;
    other: boolean;
  };
  'date-picker-prompt': ValidatedPrompt;
  'info-prompt': BasePrompt;
  'no-more-information-prompt': BasePrompt;
  'radio-list-prompt': ValidatedPrompt & {
    options: LocaleOptionList;
    orientation: RadioOrientation;
    other: boolean;
  };
  'textarea-prompt': ValidatedPrompt;
  'time-picker-prompt': ValidatedPrompt & {
    format: 'ampm' | '24hr';
  };
  'yes-no-prompt': BasePrompt;
  // Portion size
  'as-served-prompt': BasePrompt & {
    leftovers: boolean;
    linkedQuantityCategories: string[];
  };
  'cereal-prompt': BasePrompt & {
    imageMap: ImageMap;
    leftovers: boolean;
  };
  'direct-weight-prompt': BasePrompt;
  'drink-scale-prompt': BasePrompt & {
    imageMap: ImageMap;
    leftovers: boolean;
  };
  'guide-image-prompt': BasePrompt & {
    imageMap: ImageMap;
  };
  'milk-in-a-hot-drink-prompt': BasePrompt & {
    options: LocaleOptionList<number>;
    orientation: RadioOrientation;
  };
  'milk-on-cereal-prompt': BasePrompt & {
    imageMap: ImageMap;
  };
  'pizza-prompt': BasePrompt & {
    imageMap: ImageMap;
  };
  'portion-size-option-prompt': BasePrompt;
  'standard-portion-prompt': BasePrompt;
  // Standard
  'associated-foods-prompt': BasePrompt;
  'edit-meal-prompt': BasePrompt;
  'final-prompt': BasePrompt;
  'food-search-prompt': BasePrompt & {
    allowBrowsing: boolean;
    dualLanguage: boolean;
  };
  'meal-add-prompt': BasePrompt & {
    custom: boolean;
  };
  'meal-time-prompt': ValidatedPrompt & {
    format: 'ampm' | '24hr';
  };
  'ready-meal-prompt': BasePrompt;
  'redirect-prompt': BasePrompt & {
    url: string | null;
    identifier: 'userId' | 'username' | 'token' | 'custom';
    timer: number;
  };
  'review-confirm-prompt': BasePrompt;
  'same-as-before-prompt': BasePrompt;
  'split-food-prompt': BasePrompt;
  'submit-prompt': BasePrompt;
};

export type Prompt = Prompts[keyof Prompts];
