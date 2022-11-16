import type { LocaleTranslation, RequiredLocaleTranslation } from '../../types';
import type { Condition } from '../conditions';

export const promptLayouts = ['desktop', 'mobile'] as const;
export type PromptLayout = typeof promptLayouts[number];

export const promptGenericActionTypes = ['next', 'review'] as const;
export const promptMealActionTypes = ['addMeal', 'editFoods', 'deleteMeal', 'mealTime'] as const;
export const promptActionTypes = [...promptGenericActionTypes, ...promptMealActionTypes] as const;

export type PromptGenericActionType = typeof promptGenericActionTypes[number];
export type PromptMealActionType = typeof promptMealActionTypes[number];
export type PromptActionType = typeof promptActionTypes[number];

export type PromptAction = {
  type: PromptActionType;
  text: LocaleTranslation;
  label: LocaleTranslation;
  color: string | null;
  icon: string | null;
  layout: PromptLayout[];
};

export type BasePromptProps = {
  name: RequiredLocaleTranslation;
  text: LocaleTranslation;
  description: LocaleTranslation;
  actions?: PromptAction[];
  conditions: Condition[];
};

export interface PromptValidationProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

export interface ValidatedPromptProps extends BasePromptProps, PromptValidationProps {}

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

export const basePromptProps: BasePromptProps = {
  name: { en: 'Enter name' },
  text: {},
  description: {},
  conditions: [],
  actions: [],
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: {},
  },
};
