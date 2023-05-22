import type { LocaleTranslation } from '../types';

export const promptLayouts = ['desktop', 'mobile'] as const;
export type PromptLayout = (typeof promptLayouts)[number];

export const genericActionTypes = ['addMeal', 'next', 'review', 'no-more-information'] as const;
export const mealActionTypes = ['addMeal', 'deleteMeal', 'editMeal', 'mealTime'] as const;
export const foodActionTypes = ['addFood', 'deleteFood', 'editFood'] as const;
export const actionTypes = [...genericActionTypes, ...mealActionTypes, ...foodActionTypes] as const;

export type GenericActionType = (typeof genericActionTypes)[number];
export type MealActionType = (typeof mealActionTypes)[number];
export type FoodActionType = (typeof foodActionTypes)[number];
export type ActionType = (typeof actionTypes)[number];

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
