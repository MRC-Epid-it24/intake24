import type { PromptSection } from '../surveys';
import type { Actions, PromptLayout } from './actions';
import type { Condition } from './conditions';
import { type LocaleTranslation, type PortionSizeMethodId, portionSizeMethods } from '../types';

export type ListOption<T = string> = {
  id?: number;
  label: string;
  value: T;
};

export type LocaleOptionList<T = string> = {
  en: ListOption<T>[];
  [locale: string]: ListOption<T>[];
};

export type CategoryLocaleOptionList<T = number> = Record<'_default' | string, LocaleOptionList<T>>;

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
  'meal-gap-prompt',
  'meal-duration-prompt',
  'meal-time-prompt',
  'ready-meal-prompt',
  'redirect-prompt',
  'review-confirm-prompt',
  'same-as-before-prompt',
  'split-food-prompt',
  'submit-prompt',
] as const;

export type StandardComponentType = (typeof standardComponentTypes)[number];

export type PortionSizeComponentType =
  | `${PortionSizeMethodId}-prompt`
  | 'missing-food-prompt'
  | 'recipe-builder-prompt'
  | 'portion-size-option-prompt';

export const portionSizeComponentTypes = [
  ...portionSizeMethods,
  'missing-food',
  'recipe-builder-prompt',
  'portion-size-option',
].map((type) => `${type}-prompt`) as PortionSizeComponentType[];

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
  i18n: Record<string, LocaleTranslation>;
  actions?: Actions;
  conditions: Condition[];
};

export type ValidatedPrompt = BasePrompt & PromptValidationProps;

export type BasePortionPrompt = BasePrompt & { badges: boolean };

export interface PromptWithSection extends BasePrompt {
  section: PromptSection;
}

export type FoodBrowser = {
  categoriesFirst: Record<'browse' | 'search', boolean>;
};

export type ImageMap = {
  labels: boolean;
  pinchZoom: boolean;
};

export type LinkedQuantityCategory = {
  code: string;
  unit?: string;
};

export const reviewOptions = [false, 'scroll', 'checkbox', 'onecheckbox'] as const;

export type ReviewOptions = (typeof reviewOptions)[number];

export type Slider = {
  initial: number;
  min: number;
  max: number;
  step: number;
};

export type TimePicker = {
  format: 'ampm' | '24hr';
  allowedMinutes: 1 | 5 | 10 | 15 | 20 | 30;
};

export type Prompts = {
  // Custom
  'checkbox-list-prompt': ValidatedPrompt & {
    component: 'checkbox-list-prompt';
    options: LocaleOptionList;
    other: boolean;
  };
  'date-picker-prompt': ValidatedPrompt & { component: 'date-picker-prompt'; futureDates: boolean };
  'info-prompt': BasePrompt & { component: 'info-prompt' };
  'no-more-information-prompt': BasePrompt & { component: 'no-more-information-prompt' };
  'radio-list-prompt': ValidatedPrompt & {
    component: 'radio-list-prompt';
    options: LocaleOptionList;
    orientation: RadioOrientation;
    other: boolean;
  };
  'textarea-prompt': ValidatedPrompt & { component: 'textarea-prompt' };
  'time-picker-prompt': ValidatedPrompt &
    TimePicker & {
      component: 'time-picker-prompt';
    };
  'yes-no-prompt': BasePrompt & { component: 'yes-no-prompt' };
  // Portion size
  'as-served-prompt': BasePortionPrompt & {
    component: 'as-served-prompt';
    leftovers: boolean;
  };
  'cereal-prompt': BasePortionPrompt & {
    component: 'cereal-prompt';
    imageMap: ImageMap;
    leftovers: boolean;
  };
  'direct-weight-prompt': BasePortionPrompt & { component: 'direct-weight-prompt' };
  'drink-scale-prompt': BasePortionPrompt & {
    component: 'drink-scale-prompt';
    imageMap: ImageMap;
    leftovers: boolean;
    multiple: boolean | Slider;
  };
  'guide-image-prompt': BasePortionPrompt & {
    component: 'guide-image-prompt';
    imageMap: ImageMap;
    linkedQuantityCategories: LinkedQuantityCategory[];
  };
  'milk-in-a-hot-drink-prompt': BasePortionPrompt & {
    component: 'milk-in-a-hot-drink-prompt';
    orientation: RadioOrientation;
  };
  'milk-on-cereal-prompt': BasePortionPrompt & {
    component: 'milk-on-cereal-prompt';
    imageMap: ImageMap;
  };
  'missing-food-prompt': BasePortionPrompt & {
    component: 'missing-food-prompt';
  };
  'parent-food-portion-prompt': BasePortionPrompt & {
    component: 'parent-food-portion-prompt';
    orientation: RadioOrientation;
  };
  'pizza-prompt': BasePortionPrompt & {
    component: 'pizza-prompt';
    imageMap: ImageMap;
  };
  'portion-size-option-prompt': BasePortionPrompt & { component: 'portion-size-option-prompt' };
  'recipe-builder-prompt': BasePortionPrompt &
    FoodBrowser & {
      component: 'recipe-builder-prompt';
    };
  'standard-portion-prompt': BasePortionPrompt & { component: 'standard-portion-prompt' };
  // Standard
  'associated-foods-prompt': BasePrompt &
    FoodBrowser & {
      component: 'associated-foods-prompt';
      multiple: boolean;
    };
  'edit-meal-prompt': BasePrompt & { component: 'edit-meal-prompt'; separateDrinks: boolean };
  'final-prompt': BasePrompt & { component: 'final-prompt' };
  'food-search-prompt': BasePrompt &
    FoodBrowser & {
      component: 'food-search-prompt';
      allowBrowsing: boolean;
      dualLanguage: boolean;
    };
  'meal-add-prompt': BasePrompt & {
    component: 'meal-add-prompt';
    custom: boolean;
  };
  'meal-duration-prompt': BasePrompt &
    Slider & {
      component: 'meal-duration-prompt';
    };
  'meal-gap-prompt': BasePrompt & {
    component: 'meal-gap-prompt';
    gap: number;
    startTime: string;
    endTime: string;
  };
  'meal-time-prompt': BasePrompt &
    TimePicker & {
      component: 'meal-time-prompt';
    };
  'ready-meal-prompt': BasePrompt & { component: 'ready-meal-prompt' };
  'redirect-prompt': BasePrompt & {
    component: 'redirect-prompt';
    url: string | null;
    identifier: 'userId' | 'username' | 'urlAuthToken' | string | null;
    timer: number;
  };
  'review-confirm-prompt': BasePrompt & { component: 'review-confirm-prompt' };
  'same-as-before-prompt': BasePrompt & { component: 'same-as-before-prompt' };
  'split-food-prompt': BasePrompt & { component: 'split-food-prompt' };
  'submit-prompt': BasePrompt & {
    component: 'submit-prompt';
    review: Record<PromptLayout, ReviewOptions>;
  };
};

export type Prompt = Prompts[keyof Prompts];
