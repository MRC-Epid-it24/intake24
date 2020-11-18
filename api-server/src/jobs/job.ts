export interface Job {
  readonly name: string;
  run(): Promise<void>;
}

export interface JobConstructor {
  new (...args: any[]): Job;
}

export type JobType = 'PurgeRefreshTokens' | 'SendPasswordReset' | 'UploadSurveyRespondents';

export type Jobs = Record<JobType, JobConstructor>;
