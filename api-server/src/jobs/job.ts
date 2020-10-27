export interface Job {
  readonly name: string;
  run(): Promise<void>;
}

export interface JobConstructor {
  new (): Job;
}

export type JobType = 'PurgeRefreshTokens';

export type Jobs = Record<JobType, JobConstructor>;
