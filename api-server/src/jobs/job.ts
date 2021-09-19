import type { JobsOptions } from 'bullmq';
import type { IoC } from '@/ioc';

export default abstract class Job<T = any> {
  abstract readonly name: string;

  protected jobId!: string;

  protected params!: T;

  protected ops!: JobsOptions;

  protected isRepeatable!: boolean;

  protected logger;

  constructor({ logger }: Pick<IoC, 'logger'>) {
    this.logger = logger;
  }

  protected init(jobId: string, params: T, ops: JobsOptions): void {
    this.jobId = jobId;
    this.params = params;
    this.ops = ops;

    this.isRepeatable = jobId.startsWith('repeat:');

    this.logger = this.logger.child({ service: this.name, jobId, params, ops });
  }

  abstract run(jobId: string, data: T, ops: JobsOptions): Promise<void>;
}

export interface JobConstructor {
  new (...args: any[]): Job;
}
