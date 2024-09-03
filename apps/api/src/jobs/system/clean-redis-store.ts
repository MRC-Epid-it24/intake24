import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import type { RedisStore } from '@intake24/api/services';

import BaseJob from '../job';

export default class CleanRedisStore extends BaseJob<'CleanRedisStore'> {
  readonly name = 'CleanRedisStore';

  private readonly stores: Record<'cache' | 'rateLimiter' | 'session', RedisStore>;

  constructor({ cache, logger, rateLimiter, session }: Pick<IoC, 'logger' | 'cache' | 'rateLimiter' | 'session'>) {
    super({ logger });

    this.stores = { cache, rateLimiter, session };
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @memberof CleanRedisStore
   */
  public async run(job: Job) {
    this.init(job);

    this.logger.debug('Job started.');

    await this.cleanStore();

    this.logger.debug('Job finished.');
  }

  /**
   * Clean redis store
   *
   * @private
   * @memberof CleanRedisStore
   */
  private async cleanStore() {
    for (const store of this.params.store)
      await this.stores[store].flush();
  }
}
