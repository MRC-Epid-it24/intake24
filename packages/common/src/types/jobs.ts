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
export const SurveySubmission = z.object({
  surveyId: z.string(),
  userId: z.string(),
  // TODO: Fix this
  state: z.any(),
});
export const SurveySubmissionNotification = z.object({
  surveyId: z.string(),
  submissionId: z.string(),
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
  CleanRedisStore: z.object({
    store: z.union([z.literal('cache'), z.literal('session')]),
  }),
  CleanStorageFiles: z.object({}),
  FeedbackSchemesSync: z.object({}),
  LanguageTranslationsSync: z.object({}),
  LocaleIndexBuild: z.object({}),
  LocaleFoods: z.object({
    localeId: z.string(),
  }),
  LocaleFoodNutrientMapping: z.object({
    localeId: z.string(),
  }),
  LocaleFoodRankingUpload: z.object({
    localeId: z.string(),
    file: z.string(),
  }),
  NutrientTableDataImport: z.object({
    nutrientTableId: z.string(),
    file: z.string(),
  }),
  NutrientTableMappingImport: z.object({
    nutrientTableId: z.string(),
    file: z.string(),
  }),
  LocalePopularitySearchCopy: z.object({
    localeId: z.string(),
    sourceLocaleId: z.string(),
  }),
  PopularitySearchUpdateCounters: z.object({
    localeCode: z.string(),
    foodCodes: z.array(z.string()),
  }),
  PurgeExpiredTokens: z.object({}),
  SurveyAuthUrlsExport: z.object({
    surveyId: z.string(),
  }),
  SurveyDataExport: z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    surveyId: z.string(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    userId: z.string().optional(),
  }),
  SurveyFeedbackNotification: z.object({
    surveyId: z.string(),
    username: z.string(),
    submissions: z.array(z.string()).optional(),
    to: z.string(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
  }),
  SurveyHelpRequestNotification: z.object({
    surveySlug: z.string(),
    userId: z.string(),
    name: z.string(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
    phoneCountry: z.string().nullish(),
    message: z.string(),
  }),
  SurveyNutrientsRecalculation: z.object({
    surveyId: z.string(),
  }),
  SurveyRatingsExport: z.object({
    surveyId: z.string(),
  }),
  SurveyRespondentsImport: z.object({
    surveyId: z.string(),
    file: z.string(),
  }),
  SurveySchemesSync: z.object({}),
  SurveySubmission: z.object({
    surveyId: z.string(),
    userId: z.string(),
    // TODO: Fix this
    state: z.any(),
  }),
  SurveySubmissionNotification: z.object({
    surveyId: z.string(),
    submissionId: z.string(),
  }),
  UserEmailVerificationNotification: z.object({
    email: z.string(),
    userAgent: z.string().optional(),
  }),
  UserPasswordResetNotification: z.object({
    email: z.string(),
    userAgent: z.string().optional(),
  }),
});

export type JobParams = z.infer<typeof jobParams>;

export type JobType = keyof JobParams;

export const jobTypeParams = z.union([
  CleanRedisStore,
  CleanStorageFiles,
  FeedbackSchemesSync,
  LanguageTranslationsSync,
  LocaleIndexBuild,
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
  SurveyFeedbackNotification,
  SurveyHelpRequestNotification,
  SurveyNutrientsRecalculation,
  SurveyRatingsExport,
  SurveyRespondentsImport,
  SurveySchemesSync,
  SurveySubmission,
  SurveySubmissionNotification,
  UserEmailVerificationNotification,
  UserPasswordResetNotification,
]);

export const nutrientTableJobTypeParams = z.union([
  NutrientTableDataImport,
  NutrientTableMappingImport,
]);

export const nutrientTableJobs = ['NutrientTableMappingImport', 'NutrientTableDataImport'] as const;

export type NutrientTableJob = (typeof nutrientTableJobs)[number];

export type NutrientTableJobParams = (typeof nutrientTableJobs)[number];

export const jobTypes = [
  'CleanRedisStore',
  'CleanStorageFiles',
  'FeedbackSchemesSync',
  'LanguageTranslationsSync',
  'LocaleIndexBuild',
  'LocaleFoods',
  'LocaleFoodNutrientMapping',
  'LocaleFoodRankingUpload',
  'LocalePopularitySearchCopy',
  'PopularitySearchUpdateCounters',
  'PurgeExpiredTokens',
  'SurveyAuthUrlsExport',
  'SurveyDataExport',
  'SurveyFeedbackNotification',
  'SurveyHelpRequestNotification',
  'SurveyNutrientsRecalculation',
  'SurveyRatingsExport',
  'SurveyRespondentsImport',
  'SurveySchemesSync',
  'SurveySubmission',
  'SurveySubmissionNotification',
  'UserEmailVerificationNotification',
  'UserPasswordResetNotification',
  ...nutrientTableJobs,
] as const;

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
  SurveySubmission: {
    surveyId: '',
    userId: '',
    state: {} as SurveyState,
  },
  SurveySubmissionNotification: {
    surveyId: '',
    submissionId: '',
  },
  UserEmailVerificationNotification: {
    email: '',
  },
  UserPasswordResetNotification: {
    email: '',
  },
};

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export const pickJobParams = <T extends keyof JobParams>(object: object, job: T): JobParams[T] =>
  pick(object, Object.keys(defaultJobsParams[job])) as JobParams[T];

export const jobRequiresFile = <T extends keyof JobParams>(job: T) =>
  Object.keys(defaultJobsParams[job]).includes('file');

export type LocaleJob = Extract<
  JobType,
  | 'LocaleFoods'
  | 'LocaleFoodNutrientMapping'
  | 'LocaleFoodRankingUpload'
  | 'LocalePopularitySearchCopy'
>;

export const localeJobs = [
  'LocaleFoods',
  'LocaleFoodNutrientMapping',
  'LocaleFoodRankingUpload',
  'LocalePopularitySearchCopy',
] as unknown as LocaleJob[];

export type SurveyJob = Extract<
  JobType,
  | 'SurveyAuthUrlsExport'
  | 'SurveyDataExport'
  | 'SurveyNutrientsRecalculation'
  | 'SurveyRatingsExport'
  | 'SurveyRespondentsImport'
>;

export const surveyJobs = [
  'SurveyAuthUrlsExport',
  'SurveyDataExport',
  'SurveyNutrientsRecalculation',
  'SurveyRatingsExport',
  'SurveyRespondentsImport',
] as unknown as SurveyJob[];
