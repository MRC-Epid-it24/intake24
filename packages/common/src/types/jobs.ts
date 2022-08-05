import pick from 'lodash/pick';

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

export const jobTypes = [
  'CleanRedisStore',
  'CleanStorageFiles',
  'LanguageSyncTranslations',
  'LocaleCopyPairwiseAssociations',
  'NutrientTableImportMapping',
  'NutrientTableImportData',
  'PurgeRefreshTokens',
  'SendPasswordReset',
  'SendRespondentFeedback',
  'SurveyDataExport',
  'SurveyExportRespondentAuthUrls',
  'SurveyImportRespondents',
  'SurveySubmissionNotification',
] as const;

export type JobType = typeof jobTypes[number];

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export type EmptyJobParams = Record<string, never>;

export type JobParams = {
  CleanRedisStore: {
    store: 'cache' | 'session';
  };
  CleanStorageFiles: EmptyJobParams;
  LanguageSyncTranslations: EmptyJobParams;
  LocaleCopyPairwiseAssociations: {
    sourceLocaleId: string;
    targetLocaleId: string;
  };
  NutrientTableImportMapping: {
    nutrientTableId: string;
    file: string;
  };
  NutrientTableImportData: {
    nutrientTableId: string;
    file: string;
  };
  PurgeRefreshTokens: EmptyJobParams;
  SendPasswordReset: {
    email: string;
    userAgent?: string;
  };
  SendRespondentFeedback: {
    surveyId: string;
    userId: string;
    submissions?: string[];
    to: string;
    cc?: string;
    bcc?: string;
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
  SurveySubmissionNotification: {
    surveyId: string;
    submissionId: string;
  };
};

export type JobTypeParams = JobParams[keyof JobParams];

export type GetJobParams<P extends keyof JobParams> = JobParams[P];

export const defaultJobsParams: JobParams = {
  CleanRedisStore: { store: 'cache' },
  CleanStorageFiles: {},
  LanguageSyncTranslations: {},
  LocaleCopyPairwiseAssociations: {
    sourceLocaleId: '',
    targetLocaleId: '',
  },
  NutrientTableImportMapping: {
    nutrientTableId: '',
    file: '',
  },
  NutrientTableImportData: {
    nutrientTableId: '',
    file: '',
  },
  PurgeRefreshTokens: {},
  SendRespondentFeedback: {
    surveyId: '',
    userId: '',
    to: '',
  },
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
  SurveySubmissionNotification: {
    surveyId: '',
    submissionId: '',
  },
};

export const pickJobParams = <T extends keyof JobParams>(object: object, job: T): JobParams[T] =>
  pick(object, Object.keys(defaultJobsParams[job])) as JobParams[T];
