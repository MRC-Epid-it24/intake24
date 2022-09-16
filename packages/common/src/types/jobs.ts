import pick from 'lodash/pick';

import type { SurveyState } from './recall';

// Not defined in bull-mq
export type RepeatableBullJob = {
  key: string;
  name: string;
  id: string;
  endDate: number;
  tz: string;
  cron: string;
  next: number;
};

export type JobData<T = any> = { params: T };

export type EmptyJobParams = Record<string, never>;

export type JobParams = {
  CleanRedisStore: {
    store: 'cache' | 'session';
  };
  CleanStorageFiles: EmptyJobParams;
  LanguageSyncTranslations: EmptyJobParams;
  LocaleFoodNutrientMapping: {
    localeId: string;
  };
  NutrientTableImportData: {
    nutrientTableId: string;
    file: string;
  };
  NutrientTableImportMapping: {
    nutrientTableId: string;
    file: string;
  };
  PairwiseSearchCopyAssociations: {
    sourceLocaleId: string;
    targetLocaleId: string;
  };
  PopularitySearchUpdateCounters: {
    foodCodes: string[];
  };
  PurgeRefreshTokens: EmptyJobParams;
  SendPasswordReset: {
    email: string;
    userAgent?: string;
  };
  SurveyDataExport: {
    id?: string | string[];
    surveyId: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  };
  SurveyExportRespondentAuthUrls: {
    surveyId: string;
  };
  SurveyImportRespondents: {
    surveyId: string;
    file: string;
  };
  SurveyRequestHelp: {
    surveySlug: string;
    userId: string;
    name: string;
    phone: string;
  };
  SurveyRespondentFeedback: {
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
};

export type JobType = keyof JobParams;

export type JobTypeParams = JobParams[keyof JobParams];

export type GetJobParams<P extends keyof JobParams> = JobParams[P];

export const defaultJobsParams: JobParams = {
  CleanRedisStore: { store: 'cache' },
  CleanStorageFiles: {},
  LanguageSyncTranslations: {},
  LocaleFoodNutrientMapping: {
    localeId: '',
  },
  NutrientTableImportData: {
    nutrientTableId: '',
    file: '',
  },
  NutrientTableImportMapping: {
    nutrientTableId: '',
    file: '',
  },
  PairwiseSearchCopyAssociations: {
    sourceLocaleId: '',
    targetLocaleId: '',
  },
  PopularitySearchUpdateCounters: {
    foodCodes: [],
  },
  PurgeRefreshTokens: {},
  SendPasswordReset: {
    email: '',
  },
  SurveyDataExport: {
    surveyId: '',
  },
  SurveyExportRespondentAuthUrls: {
    surveyId: '',
  },
  SurveyImportRespondents: {
    surveyId: '',
    file: '',
  },
  SurveyRequestHelp: {
    surveySlug: '',
    userId: '',
    name: '',
    phone: '',
  },
  SurveyRespondentFeedback: {
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
};

export const jobTypes = Object.keys(defaultJobsParams) as JobType[];

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export const pickJobParams = <T extends keyof JobParams>(object: object, job: T): JobParams[T] =>
  pick(object, Object.keys(defaultJobsParams[job])) as JobParams[T];
