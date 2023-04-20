import type { RedisOptions } from 'ioredis';
import { Redis } from 'ioredis';

import type { Logger } from '@intake24/common-backend';

export type RedisStoreOps = {
  config: RedisOptions;
  logger: Logger;
};

export default abstract class RedisStore {
  protected readonly config;

  protected readonly logger;

  protected redis!: Redis;

  constructor({ config, logger }: RedisStoreOps) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Initialize Redis connection
   *
   * @returns {Redis}
   * @memberof HasRedisClient
   */
  init(): Redis {
    this.redis = new Redis(this.config);

    this.logger.info(`Redis connection (${this.constructor.name}) has been initialized.`);

    return this.redis;
  }

  /**
   * Close Redis connection
   *
   * @memberof HasRedisClient
   */
  close(): void {
    this.redis.disconnect();

    this.logger.info('Redis connection has been closed.');
  }

  /**
   * Flush redis store data
   *
   * @param {string} [pattern='*']
   * @returns {Promise<boolean>}
   * @memberof HasRedisClient
   */
  async flush(pattern = '*'): Promise<boolean> {
    const { keyPrefix } = this.config;

    const fullKeys = await this.redis.keys([keyPrefix ?? '', pattern].join(''));
    if (!fullKeys.length) return false;

    const keys = keyPrefix ? fullKeys.map((key) => key.replace(keyPrefix, '')) : fullKeys;

    const result = await this.redis.del(keys);

    return !!result;
  }

  /**
   * Flush whole redis store
   * This includes other parts if system if using same redis instance:
   * 1) cache data
   * 2) queue data
   * 3) session data
   *
   * @returns {Promise<boolean>}
   * @memberof HasRedisClient
   */
  async flushAll(): Promise<boolean> {
    const result = await this.redis.flushall();

    return !!result;
  }
}
