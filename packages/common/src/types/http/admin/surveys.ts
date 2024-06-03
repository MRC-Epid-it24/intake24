import { z } from 'zod';

import type {
  FeedbackSchemeAttributes,
  Pagination,
  SurveyAttributes,
  SurveyCreationAttributes,
  SurveySchemeAttributes,
  SystemLocaleAttributes,
  UserSecurableAttributes,
} from '@intake24/db';
import { schemeOverrides, surveySearchSettings, surveyStates } from '@intake24/common/surveys';

import type { FeedbackSchemeRefEntry } from './feedback-schemes';
import type { LocaleListEntry } from './locales';
import type { SurveySchemeRefEntry } from './survey-schemes';
import type { Owner } from './users';
import { notification } from '../../notifications';

export interface SurveyRequest extends Omit<SurveyCreationAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = SurveyRequest;

export interface SurveyListEntry
  extends Pick<SurveyAttributes, 'id' | 'slug' | 'name' | 'localeId' | 'surveySchemeId' | 'state'> {
  locale: Pick<SystemLocaleAttributes, 'code'>;
  surveyScheme: Pick<SurveySchemeAttributes, 'name'>;
  securables: UserSecurableAttributes[];
}

export type SurveysResponse = Pagination<SurveyListEntry>;

export const surveyAttributes = z.object({
  id: z.string(),
  slug: z.string().min(1).max(128),
  name: z.string().min(1).max(512),
  state: z.enum(surveyStates),
  startDate: z.date(),
  endDate: z.date(),
  surveySchemeId: z.string(),
  localeId: z.string(),
  allowGenUsers: z.boolean(),
  genUserKey: z.string().max(256).nullable(),
  authUrlDomainOverride: z.string().max(512).nullable(),
  authUrlTokenCharset: z.string().max(128).nullable(),
  authUrlTokenLength: z.number().nullable(),
  authCaptcha: z.boolean(),
  suspensionReason: z.string().max(512).nullable(),
  surveyMonkeyUrl: z.string().max(512).nullable(),
  supportEmail: z.string().max(512).email(),
  originatingUrl: z.string().max(512).nullable(),
  feedbackSchemeId: z.string().nullable(),
  numberOfSubmissionsForFeedback: z.number().int(),
  notifications: notification.array(),
  sessionLifetime: z.string().max(32),
  storeUserSessionOnServer: z.boolean(),
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

export interface SurveyEntry extends Omit<SurveyAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
  locale: SystemLocaleAttributes;
  feedbackScheme?: FeedbackSchemeAttributes;
  surveyScheme: SurveySchemeAttributes;
  owner?: Owner;
  securables?: UserSecurableAttributes[];
}

export type SurveyRefs = {
  locales: LocaleListEntry[];
  surveySchemes: SurveySchemeRefEntry[];
  feedbackSchemes: FeedbackSchemeRefEntry[];
};

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
