import pick from 'lodash/pick';
import { z } from 'zod';

import type { SurveyState } from './recall';

// Not defined in bull-mq
export const repeatableBullJob = z.object({
  key: z.string(),
  name: z.string(),
  id: z.string().nullable(),
  endDate: z.number().nullable(),
  tz: z.string().nullable(),
  pattern: z.string(),
  next: z.number(),
});

export type RepeatableBullJob = z.infer<typeof repeatableBullJob>;

export type JobData<T = any> = { params: T };

export const CleanRedisStore = z.object({
  store: z.union([z.literal('cache'), z.literal('session')]),
});
export const CleanStorageFiles = z.object({});
export const FeedbackSchemesSync = z.object({});
export const LanguageTranslationsSync = z.object({});
export const LocaleIndexBuild = z.object({});

export const localeCopySubTasks = ['categories', 'foods', 'associatedFoods', 'splitLists', 'splitWords', 'synonymSets', 'recipeFoods'] as const;

export const LocaleCopy = z.object({
  localeId: z.string(),
  sourceLocaleId: z.string(),
  subTasks: z.enum(localeCopySubTasks).array(),
});
export const LocaleFoods = z.object({
  localeId: z.string(),
});
export const LocaleFoodNutrientMapping = z.object({
  localeId: z.string(),
});
export const LocaleFoodRankingUpload = z.object({
  localeId: z.string(),
  file: z.string(),
});
export const NutrientTableDataImport = z.object({
  nutrientTableId: z.string(),
  file: z.string(),
});
export const NutrientTableMappingImport = z.object({
  nutrientTableId: z.string(),
  file: z.string(),
});
export const LocalePopularitySearchCopy = z.object({
  localeId: z.string(),
  sourceLocaleId: z.string(),
});
export const PopularitySearchUpdateCounters = z.object({
  localeCode: z.string(),
  foodCodes: z.array(z.string()),
});
export const PurgeExpiredTokens = z.object({});
export const SurveyAuthUrlsExport = z.object({
  surveyId: z.string(),
});
export const SurveyDataExport = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  surveyId: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  userId: z.string().optional(),
});

const baseSurveyEventNotification = z.object({
  surveyId: z.string(),
  userId: z.string(),
  sessionId: z.string(),
});

export const SurveyEventNotification = z.discriminatedUnion('type', [
  baseSurveyEventNotification.extend({
    type: z.literal('survey.session.started'),
  }),
  baseSurveyEventNotification.extend({
    type: z.literal('survey.session.cancelled'),
  }),
  baseSurveyEventNotification.extend({
    type: z.literal('survey.session.submitted'),
    submissionId: z.string(),
  }),
]);
export const SurveyFeedbackNotification = z.object({
  surveyId: z.string(),
  username: z.string(),
  submissions: z.array(z.string()).optional(),
  to: z.string(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
});
export const SurveyHelpRequestNotification = z.object({
  surveySlug: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  phoneCountry: z.string().nullish(),
  message: z.string(),
});
export const SurveyNutrientsRecalculation = z.object({
  surveyId: z.string(),
});
export const SurveyRatingsExport = z.object({
  surveyId: z.string(),
});
export const SurveyRespondentsImport = z.object({
  surveyId: z.string(),
  file: z.string(),
});
export const SurveySchemesSync = z.object({});
export const SurveySessionsExport = z.object({
  surveyId: z.string(),
});
export const SurveySubmission = z.object({
  surveyId: z.string(),
  userId: z.string(),
  // TODO: Fix this
  state: z.any(),
});
export const UserEmailVerificationNotification = z.object({
  email: z.string(),
  userAgent: z.string().optional(),
});
export const UserPasswordResetNotification = z.object({
  email: z.string(),
  userAgent: z.string().optional(),
});

export const jobParams = z.object({
  CleanRedisStore,
  CleanStorageFiles,
  FeedbackSchemesSync,
  LanguageTranslationsSync,
  LocaleIndexBuild,
  LocaleCopy,
  LocaleFoods,
  LocaleFoodNutrientMapping,
  LocaleFoodRankingUpload,
  NutrientTableDataImport,
  NutrientTableMappingImport,
  LocalePopularitySearchCopy,
  PopularitySearchUpdateCounters,
  PurgeExpiredTokens,
  SurveyAuthUrlsExport,
  SurveyDataExport,
  SurveyEventNotification,
  SurveyFeedbackNotification,
  SurveyHelpRequestNotification,
  SurveyNutrientsRecalculation,
  SurveyRatingsExport,
  SurveyRespondentsImport,
  SurveySchemesSync,
  SurveySessionsExport,
  SurveySubmission,
  UserEmailVerificationNotification,
  UserPasswordResetNotification,
});

export type JobParams = z.infer<typeof jobParams>;

export const jobTypeParams = z.union([
  CleanRedisStore,
  CleanStorageFiles,
  FeedbackSchemesSync,
  LanguageTranslationsSync,
  LocaleIndexBuild,
  LocaleCopy,
  LocaleFoods,
  LocaleFoodNutrientMapping,
  LocaleFoodRankingUpload,
  NutrientTableDataImport,
  NutrientTableMappingImport,
  LocalePopularitySearchCopy,
  PopularitySearchUpdateCounters,
  PurgeExpiredTokens,
  SurveyAuthUrlsExport,
  SurveyDataExport,
  SurveyEventNotification,
  SurveyFeedbackNotification,
  SurveyHelpRequestNotification,
  SurveyNutrientsRecalculation,
  SurveyRatingsExport,
  SurveyRespondentsImport,
  SurveySchemesSync,
  SurveySessionsExport,
  SurveySubmission,
  UserEmailVerificationNotification,
  UserPasswordResetNotification,
]);

export const localeJobs = [
  'LocaleCopy',
  'LocaleFoods',
  'LocaleFoodNutrientMapping',
  'LocaleFoodRankingUpload',
  'LocalePopularitySearchCopy',
] as const;

export type LocaleJob = (typeof localeJobs)[number];

export const nutrientTableJobs = ['NutrientTableMappingImport', 'NutrientTableDataImport'] as const;

export type NutrientTableJob = (typeof nutrientTableJobs)[number];

export const surveyJobs = [
  'SurveyAuthUrlsExport',
  'SurveyDataExport',
  'SurveyNutrientsRecalculation',
  'SurveyRatingsExport',
  'SurveyRespondentsImport',
  'SurveySessionsExport',
] as const;

export type SurveyJob = (typeof surveyJobs)[number];

export const jobTypes = [
  'CleanRedisStore',
  'CleanStorageFiles',
  'FeedbackSchemesSync',
  'LanguageTranslationsSync',
  'LocaleIndexBuild',
  'PopularitySearchUpdateCounters',
  'PurgeExpiredTokens',
  'SurveyEventNotification',
  'SurveyFeedbackNotification',
  'SurveyHelpRequestNotification',
  'SurveyRespondentsImport',
  'SurveySchemesSync',
  'SurveySubmission',
  'UserEmailVerificationNotification',
  'UserPasswordResetNotification',
  ...localeJobs,
  ...nutrientTableJobs,
  ...surveyJobs,
] as const;

export type JobType = keyof JobParams & (typeof jobTypes)[number];

export type JobTypeParams = z.infer<typeof jobTypeParams>;

export type GetJobParams<P extends keyof JobParams> = JobParams[P];

export type QueueJob = {
  userId: string;
  type: JobType;
  params: GetJobParams<JobType>;
};

export const defaultJobsParams: JobParams = {
  CleanRedisStore: { store: 'cache' },
  CleanStorageFiles: {},
  FeedbackSchemesSync: {},
  LanguageTranslationsSync: {},
  LocaleIndexBuild: {},
  LocaleCopy: {
    localeId: '',
    sourceLocaleId: '',
    subTasks: [...localeCopySubTasks],
  },
  LocaleFoods: {
    localeId: '',
  },
  LocaleFoodNutrientMapping: {
    localeId: '',
  },
  LocaleFoodRankingUpload: {
    localeId: '',
    file: '',
  },
  NutrientTableDataImport: {
    nutrientTableId: '',
    file: '',
  },
  NutrientTableMappingImport: {
    nutrientTableId: '',
    file: '',
  },
  LocalePopularitySearchCopy: {
    localeId: '',
    sourceLocaleId: '',
  },
  PopularitySearchUpdateCounters: {
    localeCode: '',
    foodCodes: [],
  },
  PurgeExpiredTokens: {},
  SurveyAuthUrlsExport: {
    surveyId: '',
  },
  SurveyDataExport: {
    id: undefined,
    surveyId: '',
    startDate: undefined,
    endDate: undefined,
    userId: undefined,
  },
  SurveyEventNotification: {
    type: 'survey.session.started',
    surveyId: '',
    sessionId: '',
    userId: '',
  },
  SurveyNutrientsRecalculation: {
    surveyId: '',
  },
  SurveyRatingsExport: {
    surveyId: '',
  },
  SurveyRespondentsImport: {
    surveyId: '',
    file: '',
  },
  SurveyHelpRequestNotification: {
    surveySlug: '',
    userId: '',
    name: '',
    email: '',
    phone: '',
    phoneCountry: 'GB',
    message: '',
  },
  SurveyFeedbackNotification: {
    surveyId: '',
    username: '',
    to: '',
  },
  SurveySchemesSync: {},
  SurveySessionsExport: {
    surveyId: '',
  },
  SurveySubmission: {
    surveyId: '',
    userId: '',
    state: {} as SurveyState,
  },
  UserEmailVerificationNotification: {
    email: '',
  },
  UserPasswordResetNotification: {
    email: '',
  },
};

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export function pickJobParams<T extends keyof JobParams>(object: object, job: T): JobParams[T] {
  return pick(object, Object.keys(defaultJobsParams[job])) as JobParams[T];
}

export function jobRequiresFile<T extends keyof JobParams>(job: T) {
  return Object.keys(defaultJobsParams[job]).includes('file');
}
