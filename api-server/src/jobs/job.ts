import { Job as DbJob } from '@api-server/db/models/system';

export type JobData<T = any> = { job: DbJob; data: T };

export interface Job {
  readonly name: string;
  run(data?: JobData): Promise<void>;
}

export interface JobConstructor {
  new (...args: any[]): Job;
}

export type JobType =
  | 'PurgeRefreshTokens'
  | 'SendPasswordReset'
  | 'SurveyDataExport'
  | 'SurveyExportRespondentAuthUrls'
  | 'SurveyImportRespondents';

export type Jobs = Record<JobType, JobConstructor>;
