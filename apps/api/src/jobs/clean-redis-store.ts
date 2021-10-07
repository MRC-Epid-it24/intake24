import { Job } from 'bullmq';
import { CleanRedisStoreParams } from '@common/types';
import type { IoC } from '@api/ioc';
import RedisStore from '@api/services/redis/redis-store';
import BaseJob from './job';

export default class CleanRedisStore extends BaseJob<CleanRedisStoreParams> {
  readonly name = 'CleanRedisStore';

  private readonly stores: Record<'cache' | 'session', RedisStore>;

  constructor({ cache, logger, session }: Pick<IoC, 'logger' | 'cache' | 'session'>) {
    super({ logger });

    this.stores = { cache, session };
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof CleanRedisStore
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.cleanStore();

    this.logger.debug('Job finished.');
  }

  /**
   * Clean redis store
   *
   * @private
   * @returns {Promise<void>}
   * @memberof CleanRedisStore
   */
  private async cleanStore(): Promise<void> {
    await this.stores[this.params.store].flush();
  }
}
