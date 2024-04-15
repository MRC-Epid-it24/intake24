import { z } from 'zod';

import {
  feedbackMeals,
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections,
  feedbackTypes,
  henryCoefficient,
  topFoods,
  weightTargetCoefficients,
} from '../../feedback';

export const feedbackSchemeResponse = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(feedbackTypes),
  sections: z.enum(feedbackSections).array(),
  outputs: z.enum(feedbackOutputs).array(),
  physicalDataFields: z.enum(feedbackPhysicalDataFields).array(),
  visibility: z.string(),
  topFoods,
  meals: feedbackMeals,
  cards: z.array(z.object({})),
  demographicGroups: z.array(z.object({})),
  henryCoefficients: henryCoefficient.array(),
});

export type FeedbackSchemeResponse = z.infer<typeof feedbackSchemeResponse>;

export const nutrientType = z.object({
  id: z.string(),
  description: z.string(),
  unit: z.string(),
  kcalPerUnit: z.number().nullable(),
});

export type NutrientType = z.infer<typeof nutrientType>;

export const physicalActivityLevel = z.object({
  id: z.string(),
  name: z.string(),
  coefficient: z.number(),
});

export type PhysicalActivityLevel = z.infer<typeof physicalActivityLevel>;

export const feedbackDataResponse = z.object({
  nutrientTypes: nutrientType.array(),
  physicalActivityLevels: physicalActivityLevel.array(),
  weightTargets: weightTargetCoefficients.array(),
});

export type FeedbackDataResponse = z.infer<typeof feedbackDataResponse>;
