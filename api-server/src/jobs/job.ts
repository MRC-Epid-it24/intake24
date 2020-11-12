export interface Job {
  readonly name: string;
  run(): Promise<void>;
}

export interface JobConstructor {
  new (...args: any[]): Job;
}

export type JobType = 'PurgeRefreshTokens' | 'SendPasswordReset';

export type Jobs = Record<JobType, JobConstructor>;
