import slugify from 'slugify';
import { isWhitelisted } from 'validator';
import { z } from 'zod';

import { identifierSafeChars } from '@intake24/common/rules';
import { schemeOverrides, sessionSettings, surveySearchSettings, surveyStates } from '@intake24/common/surveys';

import { notification } from '../../notifications';
import { feedbackSchemeAttributes } from './feedback-schemes';
import { systemLocaleAttributes } from './locales';
import { userSecurableAttributes } from './securables';
import { surveySchemeAttributes } from './survey-schemes';
import { owner } from './users';

export const surveyAttributes = z.object({
  id: z.string(),
  slug: z.string().min(1).max(128).refine(value => isWhitelisted(value, identifierSafeChars)).transform(value => slugify(value, { strict: true })),
  name: z.string().min(1).max(512),
  state: z.enum(surveyStates),
  startDate: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  endDate: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  surveySchemeId: z.string(),
  localeId: z.string(),
  allowGenUsers: z.boolean(),
  genUserKey: z.string().max(256).nullable(),
  authUrlDomainOverride: z.string().max(512).url().nullable(),
  authUrlTokenCharset: z.string().max(128).nullable().refine(value => !value || value.split('').length === [...new Set(value.split(''))].length),
  authUrlTokenLength: z.number().min(12).max(128).nullable(),
  authCaptcha: z.boolean(),
  suspensionReason: z.string().max(512).nullable(),
  surveyMonkeyUrl: z.string().max(512).nullable(),
  supportEmail: z.string().max(512).email().toLowerCase(),
  originatingUrl: z.string().max(512).nullable(),
  feedbackSchemeId: z.string().nullable(),
  numberOfSubmissionsForFeedback: z.number().int().min(1),
  notifications: notification.array(),
  session: sessionSettings,
  maximumDailySubmissions: z.number().int().min(1),
  maximumTotalSubmissions: z.number().int().min(1).nullable(),
  minimumSubmissionInterval: z.number().int().min(1),
  surveySchemeOverrides: schemeOverrides,
  searchSettings: surveySearchSettings,
  userPersonalIdentifiers: z.boolean(),
  userCustomFields: z.boolean(),
  ownerId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SurveyAttributes = z.infer<typeof surveyAttributes>;

export const surveyRequest = surveyAttributes.omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});
export type SurveyRequest = z.infer<typeof surveyRequest>;

export const surveyPartialRequest = surveyRequest.partial();
export type SurveyPartialRequest = z.infer<typeof surveyPartialRequest>;

export const surveyCreateRequest = surveyPartialRequest.required({
  slug: true,
  name: true,
  state: true,
  startDate: true,
  endDate: true,
  surveySchemeId: true,
  localeId: true,
  allowGenUsers: true,
  supportEmail: true,
});
export type SurveyCreateRequest = z.infer<typeof surveyCreateRequest>;

export const surveyEntry = surveyAttributes
  .extend({
    startDate: z.string(),
    endDate: z.string(),
    locale: systemLocaleAttributes,
    feedbackScheme: feedbackSchemeAttributes.optional(),
    surveyScheme: surveySchemeAttributes,
    owner: owner.optional(),
    securables: userSecurableAttributes.array().optional(),
  });

export const surveyListEntry = surveyAttributes.pick({
  id: true,
  slug: true,
  name: true,
  localeId: true,
  surveySchemeId: true,
  state: true,
})
  .extend({
    locale: systemLocaleAttributes.pick({
      code: true,
    }),
    surveyScheme: surveySchemeAttributes.pick({
      name: true,
    }),
    securables: userSecurableAttributes.array().optional(),
  });

export type SurveyListEntry = z.infer<typeof surveyListEntry>;

export type SurveyEntry = z.infer<typeof surveyEntry>;

export const userSurveySessionAttributes = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  surveyId: z.string(),
  // TODO: survey state
  sessionData: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSurveySessionAttributes = z.infer<typeof userSurveySessionAttributes>;
