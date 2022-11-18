import type { LocaleTranslation, RequiredLocaleTranslation } from '../../types';
import type { Condition } from '../conditions';

export const promptLayouts = ['desktop', 'mobile'] as const;
export type PromptLayout = typeof promptLayouts[number];

export const genericActionTypes = ['next', 'review'] as const;
export const mealActionTypes = [
  'addMeal',
  'deleteFood',
  'deleteMeal',
  'editMeal',
  'mealTime',
] as const;
export const actionTypes = [...genericActionTypes, ...mealActionTypes] as const;

export type GenericActionType = typeof genericActionTypes[number];
export type MealActionType = typeof mealActionTypes[number];
export type ActionType = typeof actionTypes[number];

export type ActionItem = {
  type: ActionType;
  text: LocaleTranslation;
  label: LocaleTranslation;
  color: string | null;
  icon: string | null;
  layout: PromptLayout[];
};

export type Actions = {
  both: boolean;
  items: ActionItem[];
};

export type BasePromptProps = {
  name: RequiredLocaleTranslation;
  text: LocaleTranslation;
  description: LocaleTranslation;
  actions?: Actions;
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
  actions: undefined,
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: {},
  },
};
