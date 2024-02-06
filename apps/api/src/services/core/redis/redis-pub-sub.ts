import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export class RedisPublisher extends HasRedisClient {
  constructor({ publisherConfig, logger }: Pick<IoC, 'publisherConfig' | 'logger'>) {
    super({ config: publisherConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
  }
}

export class RedisSubscriber extends HasRedisClient {
  constructor({ subscriberConfig, logger }: Pick<IoC, 'subscriberConfig' | 'logger'>) {
    super({ config: subscriberConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
  }
}
