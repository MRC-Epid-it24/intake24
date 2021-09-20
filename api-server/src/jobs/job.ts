import type { Job as BullJob } from 'bullmq';
import { JobData } from '@common/types';
import type { IoC } from '@/ioc';

export default abstract class Job<T = any> {
  abstract readonly name: string;

  protected id!: string;

  protected job!: BullJob;

  protected params!: T;

  protected isRepeatable!: boolean;

  protected logger;

  constructor({ logger }: Pick<IoC, 'logger'>) {
    this.logger = logger;
  }

  protected init(job: BullJob<JobData<T>>): void {
    const {
      id,
      data: { params },
      opts,
    } = job;

    this.logger = this.logger.child({ service: this.name, id, params, opts });

    if (!id) throw new Error('Job ID missing.');

    this.id = id;
    this.job = job;
    this.params = params;
    this.isRepeatable = id.startsWith('repeat:');
  }

  abstract run(job: BullJob<JobData<T>>): Promise<void>;
}

export interface JobConstructor {
  new (...args: any[]): Job;
}
