import { z } from 'zod';

import {
  card,
  demographicGroup,
  feedbackMeals,
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSection,
  feedbackTypes,
  henryCoefficient,
  topFoods,
} from '@intake24/common/feedback';
import { recordVisibilities } from '@intake24/common/security';

import { nutrientTypeResponse } from './nutrient-types';
import { userSecurableAttributes } from './securables';
import { owner } from './users';

export const physicalActivityLevelAttributes = z.object({
  id: z.string(),
  name: z.string().max(512),
  coefficient: z.number(),
});

export type PhysicalActivityLevelAttributes = z.infer<typeof physicalActivityLevelAttributes>;

export const feedbackSchemeAttributes = z.object({
  id: z.string(),
  name: z.string().min(1).max(256),
  type: z.enum(feedbackTypes),
  sections: feedbackSection.array(),
  outputs: z.enum(feedbackOutputs).array(),
  physicalDataFields: z.enum(feedbackPhysicalDataFields).array(),
  topFoods,
  meals: feedbackMeals,
  cards: card.array(),
  demographicGroups: demographicGroup.array(),
  henryCoefficients: henryCoefficient.array(),
  ownerId: z.string().nullable(),
  visibility: z.enum(recordVisibilities),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FeedbackSchemeAttributes = z.infer<typeof feedbackSchemeAttributes>;

export const feedbackSchemeRequest = feedbackSchemeAttributes.omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});
export type FeedbackSchemeRequest = z.infer<typeof feedbackSchemeCreateRequest>;

export const feedbackSchemePartialRequest = feedbackSchemeRequest.partial();
export type FeedbackSchemePartialRequest = z.infer<typeof feedbackSchemePartialRequest>;

export const feedbackSchemeCreateRequest = feedbackSchemePartialRequest.required({ name: true });
export type FeedbackSchemeCreateRequest = z.infer<typeof feedbackSchemeCreateRequest>;

export type FeedbackSchemeRefEntry = FeedbackSchemeAttributes;

export const feedbackSchemeEntry = feedbackSchemeAttributes.extend({
  owner: owner.optional(),
  securables: userSecurableAttributes.array().optional(),
});

export type FeedbackSchemeEntry = z.infer<typeof feedbackSchemeEntry>;

export const feedbackImage = z.object({
  id: z.string(),
  url: z.string(),
});

export type FeedbackImage = z.infer<typeof feedbackImage>;

export const feedbackSchemeRefs = z.object({
  nutrientTypes: nutrientTypeResponse.array(),
  physicalActivityLevels: physicalActivityLevelAttributes.array(),
  images: feedbackImage.array(),
});

export type FeedbackSchemeRefs = z.infer<typeof feedbackSchemeRefs>;
