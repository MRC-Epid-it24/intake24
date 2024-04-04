import { getSupportedRegionCodes, parsePhoneNumber } from 'awesome-phonenumber';
import { isIn } from 'validator';

import type { SurveySchemeAttributes } from '@intake24/db';
import {
  schemeTypes,
  searchSortingAlgorithms,
  surveyRatings,
  surveyStates,
} from '@intake24/common/surveys';

import { feedbackSchemeSchema } from '../../schemas';
import { z } from '../../util';
import { meal } from '../meals';

export const generateUserResponse = z.object({
  username: z.string(),
  password: z.string(),
});

export type GenerateUserResponse = z.infer<typeof generateUserResponse>;

export const createUserResponse = z.object({
  userId: z.string(),
  username: z.string(),
  authToken: z.string(),
  redirectUrl: z.string().optional(),
});

export type CreateUserResponse = z.infer<typeof createUserResponse>;

export const publicSurveyEntry = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  localeId: z.string(),
  originatingUrl: z.string().nullable(),
  supportEmail: z.string(),
  openAccess: z.boolean(),
  authCaptcha: z.boolean(),
});

export type PublicSurveyEntry = z.infer<typeof publicSurveyEntry>;

export type SchemeEntryResponse = Pick<SurveySchemeAttributes, 'id' | 'type' | 'meals' | 'prompts'>;

export const surveyEntryResponse = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  state: z.enum(surveyStates),
  locale: z.object({ id: z.string(), code: z.string() }),
  surveyScheme: z.object({
    id: z.string(),
    type: z.enum(schemeTypes),
    meals: meal.array(),
    // TODO: validate meals and prompts
    prompts: z.any(),
  }),
  feedbackScheme: feedbackSchemeSchema.optional(),
  numberOfSubmissionsForFeedback: z.number(),
  sessionLifetime: z.number(),
  storeUserSessionOnServer: z.boolean(),
  suspensionReason: z.string().nullable(),
  searchSortingAlgorithm: z.enum(searchSortingAlgorithms),
  searchMatchScoreWeight: z.number(),
});

// TODO: write zod prompts schema
export type SurveyEntryResponse = z.infer<typeof surveyEntryResponse>;

export const surveyUserInfoResponse = z.object({
  userId: z.string().openapi({ title: 'Internal (numerical) Intake24 user ID' }),
  name: z.string().nullable().openapi({
    title: 'Optional user name for personalization',
  }),
  submissions: z.number().openapi({ description: 'Number of collected submissions' }),
  showFeedback: z.boolean().openapi({ description: 'Whether to show feedback' }),
  maximumTotalSubmissionsReached: z.boolean().openapi({
    description: 'Whether the user has reached the maximum number of submissions',
  }),
  maximumDailySubmissionsReached: z.boolean().openapi({
    description: 'Whether the user has reached the maximum number of submissions per day',
  }),
  followUpUrl: z
    .union([z.string(), z.record(z.string())])
    .nullish()
    .openapi({ description: 'Optional follow-up URL for user redirect' }),
});

export type SurveyUserInfoResponse = z.infer<typeof surveyUserInfoResponse>;

export const surveySubmissionResponse = surveyUserInfoResponse.extend({
  submission: z.object({ id: z.string(), submissionTime: z.date() }),
});

export type SurveySubmissionResponse = z.infer<typeof surveySubmissionResponse>;

export const surveyUserSessionResponse = z.object({
  userId: z.string(),
  surveyId: z.string(),
  sessionData: z.any(),
});

export type SurveyUserSessionResponse = z.infer<typeof surveyUserSessionResponse>;

export const surveyHelpRequest = z
  .object({
    name: z.string(),
    email: z.string().email().toLowerCase().nullish(),
    phone: z.string().nullish(),
    phoneCountry: z
      .string()
      .nullish()
      .refine((value) => (value ? isIn(value, getSupportedRegionCodes()) : true)),
    message: z.string().max(500),
  })
  .refine(
    (data) => {
      if (!data.email && !data.phone) return false;

      if (data.phone) {
        if (!data.phoneCountry) return false;

        if (!parsePhoneNumber(data.phone, { regionCode: data.phoneCountry }).valid) return false;
      }

      return true;
    },
    {
      message: 'Valid email or phone is required',
      path: ['email'],
    }
  )
  .transform((data) => {
    if (!data.phone || !data.phoneCountry) return data;

    const phoneNumber = parsePhoneNumber(data.phone, { regionCode: data.phoneCountry });
    if (!phoneNumber.valid) return data;

    return { ...data, phone: phoneNumber.number.international };
  });

export type SurveyHelpRequest = z.infer<typeof surveyHelpRequest>;

export const surveyRatingRequest = z.object({
  type: z.enum(surveyRatings),
  rating: z.number().min(1).max(5),
  submissionId: z.string().uuid().optional(),
  comment: z.string().max(500).nullish(),
});

export type SurveyRatingRequest = z.infer<typeof surveyRatingRequest>;
