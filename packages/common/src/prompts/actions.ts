import { z } from 'zod';

import { localeTranslation } from '../types';

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

export const actionItem = z.object({
  type: z.enum(actionTypes),
  params: z.any(),
  text: localeTranslation,
  label: localeTranslation,
  color: z.string().nullable(),
  variant: z.enum(actionVariants),
  icon: z.string().nullable(),
  layout: z.enum(promptLayouts).array(),
});

export type ActionItem = z.infer<typeof actionItem>; ;

export const actions = z.object({
  both: z.boolean(),
  items: actionItem.array(),
});

export type Actions = z.infer<typeof actions>;
