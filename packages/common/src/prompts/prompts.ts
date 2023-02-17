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
  'missing-food-prompt',
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
    component: 'checkbox-list-prompt';
    options: LocaleOptionList;
    other: boolean;
  };
  'date-picker-prompt': ValidatedPrompt & { component: 'date-picker-prompt' };
  'info-prompt': BasePrompt & { component: 'info-prompt' };
  'no-more-information-prompt': BasePrompt & { component: 'no-more-information-prompt' };
  'radio-list-prompt': ValidatedPrompt & {
    component: 'radio-list-prompt';
    options: LocaleOptionList;
    orientation: RadioOrientation;
    other: boolean;
  };
  'textarea-prompt': ValidatedPrompt & { component: 'textarea-prompt' };
  'time-picker-prompt': ValidatedPrompt & {
    component: 'time-picker-prompt';
    format: 'ampm' | '24hr';
  };
  'yes-no-prompt': BasePrompt & { component: 'yes-no-prompt' };
  // Portion size
  'as-served-prompt': BasePrompt & {
    component: 'as-served-prompt';
    leftovers: boolean;
    linkedQuantityCategories: { code: string; unit?: string }[];
  };
  'cereal-prompt': BasePrompt & {
    component: 'cereal-prompt';
    imageMap: ImageMap;
    leftovers: boolean;
  };
  'direct-weight-prompt': BasePrompt & { component: 'direct-weight-prompt' };
  'drink-scale-prompt': BasePrompt & {
    component: 'drink-scale-prompt';
    imageMap: ImageMap;
    leftovers: boolean;
  };
  'guide-image-prompt': BasePrompt & {
    component: 'guide-image-prompt';
    imageMap: ImageMap;
  };
  'milk-in-a-hot-drink-prompt': BasePrompt & {
    component: 'milk-in-a-hot-drink-prompt';
    options: LocaleOptionList<number>;
    orientation: RadioOrientation;
  };
  'milk-on-cereal-prompt': BasePrompt & {
    component: 'milk-on-cereal-prompt';
    imageMap: ImageMap;
  };
  'missing-food-prompt': BasePrompt & {
    component: 'missing-food-prompt';
  };
  'pizza-prompt': BasePrompt & {
    component: 'pizza-prompt';
    imageMap: ImageMap;
  };
  'portion-size-option-prompt': BasePrompt & { component: 'portion-size-option-prompt' };
  'standard-portion-prompt': BasePrompt & { component: 'standard-portion-prompt' };
  // Standard
  'associated-foods-prompt': BasePrompt & { component: 'associated-foods-prompt' };
  'edit-meal-prompt': BasePrompt & { component: 'edit-meal-prompt' };
  'final-prompt': BasePrompt & { component: 'final-prompt' };
  'food-search-prompt': BasePrompt & {
    component: 'food-search-prompt';
    allowBrowsing: boolean;
    dualLanguage: boolean;
  };
  'meal-add-prompt': BasePrompt & {
    component: 'meal-add-prompt';
    custom: boolean;
  };
  'meal-time-prompt': ValidatedPrompt & {
    component: 'meal-time-prompt';
    format: 'ampm' | '24hr';
  };
  'ready-meal-prompt': BasePrompt & { component: 'ready-meal-prompt' };
  'redirect-prompt': BasePrompt & {
    component: 'redirect-prompt';
    url: string | null;
    identifier: 'userId' | 'username' | 'token' | 'custom';
    timer: number;
  };
  'review-confirm-prompt': BasePrompt & { component: 'review-confirm-prompt' };
  'same-as-before-prompt': BasePrompt & { component: 'same-as-before-prompt' };
  'split-food-prompt': BasePrompt & { component: 'split-food-prompt' };
  'submit-prompt': BasePrompt & { component: 'submit-prompt' };
};

export type Prompt = Prompts[keyof Prompts];
