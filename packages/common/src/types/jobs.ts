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
  'NutrientTableImportMapping',
  'NutrientTableImportData',
  'PurgeRefreshTokens',
  'SendPasswordReset',
  'SendRespondentFeedback',
  'SurveyDataExport',
  'SurveyExportRespondentAuthUrls',
  'SurveyImportRespondents',
  'SurveySubmissionNotification',
  'SyncLanguageTranslations',
] as const;

export type JobType = typeof jobTypes[number];

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export type EmptyJobParams = Record<string, never>;

export type CleanRedisStoreParams = {
  store: 'cache' | 'session';
};

export type CleanStorageFilesParams = EmptyJobParams;
export type PurgeRefreshTokensParams = EmptyJobParams;

export type SendPasswordResetParams = {
  email: string;
  token: string;
};

export type SendRespondentFeedbackParams = {
  surveyId: string;
  userId: string;
  submissions?: string[];
  to: string;
  cc?: string;
  bcc?: string;
};

export type SyncLanguageTranslationsParams = EmptyJobParams;

export type NutrientTableImportMappingParams = {
  nutrientTableId: string;
  file: string;
};

export type NutrientTableImportDataParams = {
  nutrientTableId: string;
  file: string;
};

export type SurveyDataExportParams = {
  id?: string | string[];
  surveyId: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
};

export type SurveyExportRespondentAuthUrlsParams = {
  surveyId: string;
};

export type SurveyImportRespondentsParams = {
  surveyId: string;
  file: string;
};

export type SurveySubmissionNotificationParams = {
  surveyId: string;
  submissionId: string;
};

export type JobParams =
  | CleanRedisStoreParams
  | CleanStorageFilesParams
  | PurgeRefreshTokensParams
  | NutrientTableImportMappingParams
  | NutrientTableImportDataParams
  | SendPasswordResetParams
  | SendRespondentFeedbackParams
  | SurveyDataExportParams
  | SurveyExportRespondentAuthUrlsParams
  | SurveyImportRespondentsParams
  | SurveySubmissionNotificationParams
  | SyncLanguageTranslationsParams;

export type JobParamsList = {
  CleanRedisStore: CleanRedisStoreParams;
  CleanStorageFiles: CleanStorageFilesParams;
  PurgeRefreshTokens: PurgeRefreshTokensParams;
  NutrientTableImportMapping: NutrientTableImportMappingParams;
  NutrientTableImportData: NutrientTableImportDataParams;
  SendPasswordReset: SendPasswordResetParams;
  SendRespondentFeedback: SendRespondentFeedbackParams;
  SurveyDataExport: SurveyDataExportParams;
  SurveyExportRespondentAuthUrls: SurveyExportRespondentAuthUrlsParams;
  SurveyImportRespondents: SurveyImportRespondentsParams;
  SurveySubmissionNotification: SurveySubmissionNotificationParams;
  SyncLanguageTranslations: SyncLanguageTranslationsParams;
};

export type GetJobParams<P extends keyof JobParamsList> = JobParamsList[P];
