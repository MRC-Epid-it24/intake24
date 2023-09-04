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
  FoodRankingCsvUpload: {
    localeId: number;
    localeCode: string;
    file: string;
  };
  NutrientTableDataImport: {
    nutrientTableId: string;
    file: string;
  };
  NutrientTableIMappingImport: {
    nutrientTableId: string;
    file: string;
  };
  PairwiseSearchCopyAssociations: {
    sourceLocaleId: string;
    targetLocaleId: string;
  };
  PopularitySearchUpdateCounters: {
    localeCode: string;
    foodCodes: string[];
  };
  PurgeRefreshTokens: EmptyJobParams;
  SurveyDataExport: {
    id?: string | string[];
    surveyId: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  };
  SurveyAuthUrlsExport: {
    surveyId: string;
  };
  SurveyRespondentsImport: {
    surveyId: string;
    file: string;
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
  SurveyFeedbackNotification: {
    surveyId: string;
    userId: string;
    submissions?: string[];
    to: string;
    cc?: string;
    bcc?: string;
  };
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
  FoodRankingCsvUpload: {
    localeId: 0,
    localeCode: '',
    file: '',
  },
  NutrientTableDataImport: {
    nutrientTableId: '',
    file: '',
  },
  NutrientTableIMappingImport: {
    nutrientTableId: '',
    file: '',
  },
  PairwiseSearchCopyAssociations: {
    sourceLocaleId: '',
    targetLocaleId: '',
  },
  PopularitySearchUpdateCounters: {
    localeCode: '',
    foodCodes: [],
  },
  PurgeRefreshTokens: {},
  SurveyDataExport: {
    surveyId: '',
  },
  SurveyAuthUrlsExport: {
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
