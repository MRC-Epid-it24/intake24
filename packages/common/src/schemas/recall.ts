import { z } from 'zod';

import { localeTranslation, type Optional } from '@intake24/common/types';

export const mealTime = z.object({
  hours: z.number(),
  minutes: z.number(),
});

export type MealTime = z.infer<typeof mealTime>;

export const mealState = z.object({
  id: z.string(),
  name: localeTranslation,
  defaultTime: mealTime,
  time: mealTime.optional(),
  duration: z.number().nullable(),
  // TODO: Add flags
  flags: z.array(z.string()),
  customPromptAnswers: z.record(z.string()),
  foods: z.array(z.any()),
});

export type MealState = z.infer<typeof mealState>;

export type MealCreationState = Optional<
  Pick<MealState, 'name' | 'time' | 'duration' | 'flags'>,
  'flags' | 'time' | 'duration' | 'flags'
>;

export const selectMeal = z.object({
  type: z.literal('meal'),
  mealId: z.string(),
});

export type SelectedMeal = z.infer<typeof selectMeal>;

export const selectFood = z.object({
  type: z.literal('food'),
  foodId: z.string(),
});

export type SelectedFood = z.infer<typeof selectFood>;

export const selectionModes = ['manual', 'auto'] as const;
export const selectionMode = z.enum(selectionModes);

export type SelectionMode = (typeof selectionModes)[number];

export const selection = z.object({
  element: z.union([z.null(), selectMeal, selectFood]),
  mode: selectionMode,
});

export type Selection = z.infer<typeof selection>;

export const surveyState = z.object({
  id: z.string().optional(),
  schemeId: z.string().nullable(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  submissionTime: z.date().nullable(),
  uxSessionId: z.string(),
  userAgent: z.string().nullable(),
  flags: z.array(z.string()),
  customPromptAnswers: z.record(z.string()),
  selection,
  meals: mealState.array(),
});

export type SurveyState = z.infer<typeof surveyState>;
