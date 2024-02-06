import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export default class RedisSet extends HasRedisClient {
  private readonly setName: string;
  constructor({ setConfig: setConfig, logger }: Pick<IoC, 'setConfig' | 'logger'>) {
    super({ config: setConfig.redis, logger: logger.child({ service: 'Redis-Set' }) });
    this.setName = setConfig.setName;
  }

  // Add a value to the set
  async addToSet(value: string) {
    return this.redis.sadd(this.setName, value);
  }

  // Read the set
  async readSet() {
    return this.redis.smembers(this.setName);
  }

  // Remove a value from the set
  async removeFromSet(value: string) {
    return this.redis.srem(this.setName, value);
  }

  // Check if a value is in the set
  async isMember(value: string) {
    return this.redis.sismember(this.setName, value);
  }

  // Get the number of members in the set
  async getSetSize() {
    return this.redis.scard(this.setName);
  }

  // Remove the set
  async removeSet() {
    return this.redis.del(this.setName);
  }
}
