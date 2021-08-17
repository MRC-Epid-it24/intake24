import type { JobsOptions } from 'bullmq';
import type { IoC } from '@/ioc';

export default abstract class Job<T = any> {
  readonly name!: string;

  protected jobId!: string;

  protected params!: T;

  protected ops!: JobsOptions;

  protected isRepeatable!: boolean;

  protected readonly logger;

  constructor({ logger }: Pick<IoC, 'logger'>) {
    this.logger = logger;
  }

  abstract run(jobId: string, data: T, ops: JobsOptions): Promise<void>;

  protected init(jobId: string, params: T, ops: JobsOptions): void {
    this.jobId = jobId;
    this.params = params;
    this.ops = ops;

    this.isRepeatable = jobId.startsWith('repeat:');
  }
}

export interface JobConstructor {
  new (...args: any[]): Job;
}
