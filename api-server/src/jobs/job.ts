import type { Job as BullJob } from 'bullmq';
import { JobData } from '@common/types';
import type { IoC } from '@/ioc';

export type JobProgress = { done: number; all: number };

export default abstract class Job<T = any> {
  abstract readonly name: string;

  protected id!: string;

  protected job!: BullJob;

  protected params!: T;

  protected isRepeatable!: boolean;

  protected logger;

  private progress: JobProgress = { done: 0, all: 0 };

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

  /**
   * To be implemented by each job
   *
   * @abstract
   * @param {BullJob<JobData<T>>} job
   * @returns {Promise<void>}
   * @memberof Job
   */
  abstract run(job: BullJob<JobData<T>>): Promise<void>;

  /**
   * Get current progress
   *
   * @protected
   * @returns {number}
   * @memberof Job
   */
  protected getProgress(): number {
    const result = this.progress.done / this.progress.all;
    return Math.round(result * 10000) / 10000;
  }

  /**
   * Initialize progress with setting total records
   *
   * @protected
   * @param {number} records
   * @memberof Job
   */
  protected initProgress(records: number): void {
    this.progress.all = records;
  }

  /**
   * Update current progress, emit update if greater than zero
   *
   * @protected
   * @param {number} done
   * @returns {Promise<void>}
   * @memberof Job
   */
  protected async updateProgress(done: number): Promise<void> {
    this.progress.done += done;

    const current = this.getProgress();
    if (!current) return;

    await this.job.updateProgress(current);
  }
}

export interface JobConstructor {
  new (...args: any[]): Job;
}
