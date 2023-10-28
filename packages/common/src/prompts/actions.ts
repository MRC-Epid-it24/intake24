import type { LocaleTranslation } from '../types';

export const promptLayouts = ['desktop', 'mobile'] as const;
export type PromptLayout = (typeof promptLayouts)[number];

export const genericActionTypes = ['addMeal', 'next', 'review'] as const;
export const mealActionTypes = [
  'addMeal',
  'deleteMeal',
  'editMeal',
  'mealTime',
  'selectMeal',
] as const;
export const foodActionTypes = [
  'addFood',
  'deleteFood',
  'editFood',
  'selectFood',
  'changeFood',
] as const;
export const actionTypes = [...genericActionTypes, ...mealActionTypes, ...foodActionTypes] as const;

export type GenericActionType = (typeof genericActionTypes)[number];
export type MealActionType = (typeof mealActionTypes)[number];
export type FoodActionType = (typeof foodActionTypes)[number];
export type ActionType = (typeof actionTypes)[number];

export const actionVariants = ['elevated', 'outlined', 'text'] as const;

export type ActionVariant = (typeof actionVariants)[number];

export type ActionItem = {
  type: ActionType;
  params: object;
  text: LocaleTranslation;
  label: LocaleTranslation;
  color: string | null;
  variant: ActionVariant;
  icon: string | null;
  layout: PromptLayout[];
};

export type Actions = {
  both: boolean;
  items: ActionItem[];
};
