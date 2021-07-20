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
  'CleanStorageFiles',
  'PurgeRefreshTokens',
  'SendPasswordReset',
  'SurveyDataExport',
  'SurveyExportRespondentAuthUrls',
  'SurveyImportRespondents',
] as const;

export type JobType = typeof jobTypes[number];

export const isValidJob = (job: any): boolean => jobTypes.includes(job);

export type EmptyJobParams = Record<string, never>;

export type CleanStorageFilesParams = EmptyJobParams;
export type PurgeRefreshTokensParams = EmptyJobParams;

export type SendPasswordResetParams = {
  email: string;
  token: string;
};

export type SurveyDataExportParams = {
  id?: string | string[];
  surveyId: string;
  startDate?: Date;
  endDate?: Date;
  userId?: number;
};

export type SurveyExportRespondentAuthUrlsParams = {
  surveyId: string;
};

export type SurveyImportRespondentsParams = {
  surveyId: string;
  file: string;
};

export type JobParams =
  | CleanStorageFilesParams
  | PurgeRefreshTokensParams
  | SendPasswordResetParams
  | SurveyDataExportParams
  | SurveyExportRespondentAuthUrlsParams
  | SurveyImportRespondentsParams;

export type JobParamsList = {
  CleanStorageFiles: CleanStorageFilesParams;
  PurgeRefreshTokens: PurgeRefreshTokensParams;
  SendPasswordReset: SendPasswordResetParams;
  SurveyDataExport: SurveyDataExportParams;
  SurveyExportRespondentAuthUrls: SurveyExportRespondentAuthUrlsParams;
  SurveyImportRespondents: SurveyImportRespondentsParams;
};

export type GetJobParams<P extends keyof JobParamsList> = JobParamsList[P];
