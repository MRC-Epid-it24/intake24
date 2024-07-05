import { z } from 'zod';

import { singlePrompt } from '@intake24/common/prompts';
import { promptSections } from '@intake24/common/surveys';

import { surveySchemeAttributes } from './survey-schemes';

export const surveySchemePromptAttributes = z.object({
  id: z.string(),
  promptId: z.string().min(1).max(128),
  name: z.string().min(1).max(512),
  prompt: singlePrompt,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type SurveySchemePromptAttributes = z.infer<typeof surveySchemePromptAttributes>;

export type SurveySchemePromptEntry = SurveySchemePromptAttributes;

export const surveySchemePromptRequest = surveySchemePromptAttributes.pick({
  prompt: true,
});
export type SurveySchemePromptRequest = z.infer<typeof surveySchemePromptRequest>;

export const surveySchemePromptSyncRequest = z.object({
  surveySchemeId: z.string(),
  section: z.enum(promptSections),
  prompt: singlePrompt,
});
export type SurveySchemePromptSyncRequest = z.infer<typeof surveySchemePromptSyncRequest>;

export const surveySchemePromptRefs = z.object({
  schemes: surveySchemeAttributes.array(),
  promptIds: z.string().array(),
});
export type SurveySchemePromptRefs = z.infer<typeof surveySchemePromptRefs>;
