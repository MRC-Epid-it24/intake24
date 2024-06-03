import { z } from 'zod';

import { prompt } from '@intake24/common/prompts';
import { recordVisibilities } from '@intake24/common/security';
import { exportField, exportSection, exportSectionIds, meal, recallPrompts, schemeTypes } from '@intake24/common/surveys';

import { paginationMeta } from '../generic';
import { userSecurableAttributes } from './securables';
import { owner } from './users';

export const surveySchemeAttributes = z.object({
  id: z.string(),
  name: z.string().min(1).max(256),
  type: z.enum(schemeTypes),
  prompts: recallPrompts,
  meals: meal.array(),
  dataExport: exportSection.array(),
  ownerId: z.string().nullable(),
  visibility: z.enum(recordVisibilities),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type SurveySchemeAttributes = z.infer<typeof surveySchemeAttributes>;

export const surveySchemeRequest = surveySchemeAttributes.omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});
export type SurveySchemeRequest = z.infer<typeof surveySchemeRequest>;

export const surveySchemePartialRequest = surveySchemeRequest.partial();
export type SurveySchemePartialRequest = z.infer<typeof surveySchemePartialRequest>;

export const surveySchemeCreateRequest = surveySchemePartialRequest.required({ name: true });
export type SurveySchemeCreateRequest = z.infer<typeof surveySchemeCreateRequest>;

export type SurveySchemeRefEntry = SurveySchemeAttributes;

export const surveySchemeEntry = surveySchemeAttributes.extend({
  owner: owner.optional(),
  securables: userSecurableAttributes.array().optional(),
});

export type SurveySchemeEntry = z.infer<typeof surveySchemeEntry>;

export const surveySchemeRefs = z.object({
  templates: prompt.array(),
});

export type SurveySchemeRefs = z.infer<typeof surveySchemeRefs>;

export const surveySchemeTemplates = z.object({
  data: prompt.array(),
  meta: paginationMeta,
});
export type SurveySchemeTemplates = z.infer<typeof surveySchemeTemplates>;

export const surveySchemeExportRefs = z.record(z.enum(exportSectionIds), exportField.array());
export type SurveySchemeExportRefs = z.infer<typeof surveySchemeExportRefs>;
