import pick from 'lodash/pick';

import type { SurveyState } from './recall';

// Not defined in bull-mq
export type RepeatableBullJob = {
  key: string;
  name: string;
  id: string;
  endDate: number;
  tz: string;
  pattern: string;
  next: number;
};

export type JobData<T = any> = { params: T };

export type EmptyJobParams = Record<string, never>;

export type JobParams = {
  CleanRedisStore: {
    store: 'cache' | 'session';
  };
  CleanStorageFiles: EmptyJobParams;
  LanguageTranslationsSync: EmptyJobParams;
  LocaleFoods: {
    localeId: string;
  };
  LocaleFoodNutrientMapping: {
    localeId: string;
  };
  LocaleFoodRankingUpload: {
    localeId: string;
    file: string;
  };
  LocalePopularitySearchCopy: {
    localeId: string;
    sourceLocaleId: string;
  };
  NutrientTableDataImport: {
    nutrientTableId: string;
    file: string;
  };
  NutrientTableMappingImport: {
    nutrientTableId: string;
    file: string;
  };
  PopularitySearchUpdateCounters: {
    localeCode: string;
    foodCodes: string[];
  };
  PurgeRefreshTokens: EmptyJobParams;
  SurveyAuthUrlsExport: {
    surveyId: string;
  };
  SurveyDataExport: {
    id?: string | string[];
    surveyId: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  };
  SurveyFeedbackNotification: {
    surveyId: string;
    userId: string;
    submissions?: string[];
    to: string;
    cc?: string;
    bcc?: string;
  };
  SurveyHelpRequestNotification: {
    surveySlug: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    phoneCountry: string;
    message: string;
  };
  SurveyNutrientsRecalculation: {
    surveyId: string;
  };
  SurveyRespondentsImport: {
    surveyId: string;
    file: string;
  };
  SurveySchemesSync: EmptyJobParams;
  SurveySubmission: {
    surveyId: string;
    userId: string;
    state: SurveyState;
  };
  SurveySubmissionNotification: {
    surveyId: string;
    submissionId: string;
  };
  UserEmailVerificationNotification: {
    email: string;
    userAgent?: string;
  };
  UserPasswordResetNotification: {
    email: string;
    userAgent?: string;
  };
};

export type JobType = keyof JobParams;

export type JobTypeParams = JobParams[keyof JobParams];

export type GetJobParams<P extends keyof JobParams> = JobParams[P];

export type QueueJob = {
  userId: string;
  type: JobType;
  params: GetJobParams<JobType>;
};

export const defaultJobsParams: JobParams = {
  CleanRedisStore: { store: 'cache' },
  CleanStorageFiles: {},
  LanguageTranslationsSync: {},
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
  PurgeRefreshTokens: {},
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
    userId: '',
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

export const jobTypes = Object.keys(defaultJobsParams) as JobType[];

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

export type NutrientTableJob = Extract<
  JobType,
  'NutrientTableMappingImport' | 'NutrientTableDataImport'
>;

export const nutrientTableJobs = [
  'NutrientTableMappingImport',
  'NutrientTableDataImport',
] as unknown as NutrientTableJob[];

export type SurveyJob = Extract<
  JobType,
  | 'SurveyAuthUrlsExport'
  | 'SurveyDataExport'
  | 'SurveyNutrientsRecalculation'
  | 'SurveyRespondentsImport'
>;

export const surveyJobs = [
  'SurveyAuthUrlsExport',
  'SurveyDataExport',
  'SurveyNutrientsRecalculation',
  'SurveyRespondentsImport',
] as unknown as SurveyJob[];
