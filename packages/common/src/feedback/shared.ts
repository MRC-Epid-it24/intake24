import { z } from 'zod';

import { localeTranslation } from '../types';

export const feedbackTypes = ['default', 'playful'] as const;
export type FeedbackType = (typeof feedbackTypes)[number];

export const feedbackOutputs = ['download', 'email', 'print'] as const;
export type FeedbackOutput = (typeof feedbackOutputs)[number];

export const feedbackSections = ['cards', 'meals', 'topFoods', 'rating'] as const;
export type FeedbackSection = (typeof feedbackSections)[number];

export const feedbackPhysicalDataFields = [
  'sex',
  'weightKg',
  'heightCm',
  'physicalActivityLevelId',
  'birthdate',
  'weightTarget',
] as const;
export type FeedbackPhysicalDataField = (typeof feedbackPhysicalDataFields)[number];

export const nutrientRuleTypes = [
  'energy_divided_by_bmr',
  'percentage_of_energy',
  'per_unit_of_weight',
  'range',
] as const;
export type NutrientRuleType = (typeof nutrientRuleTypes)[number];

export const range = z.object({
  start: z.number(),
  end: z.number(),
});

export type Range = z.infer<typeof range>;

export const sentiments = [
  'too_low',
  'low',
  'bit_low',
  'good',
  'excellent',
  'high',
  'bit_high',
  'too_high',
] as const;
export type Sentiment = (typeof sentiments)[number];

export const sexes = ['f', 'm'] as const;
export type Sex = (typeof sexes)[number];

export const weightTargets = ['keep_weight', 'lose_weight', 'gain_weight'] as const;
export type WeightTarget = (typeof weightTargets)[number];

export const weightTargetCoefficients = z.object({
  id: z.string(),
  name: z.string(),
  coefficient: z.number(),
});

export type WeightTargetCoefficient = z.infer<typeof weightTargetCoefficients>;

export const weightTargetsData: WeightTargetCoefficient[] = [
  { id: 'keep_weight', name: 'Keep weight', coefficient: 0 },
  { id: 'lose_weight', name: 'Lose weight', coefficient: -500 },
  { id: 'gain_weight', name: 'Gain weight', coefficient: 500 },
];

export const nutrient = z.object({
  id: z.array(z.string()),
  name: localeTranslation,
});

export type Nutrient = z.infer<typeof nutrient>;
