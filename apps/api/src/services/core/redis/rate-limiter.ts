import rateLimit, { Options } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import type { IoC } from '@intake24/api/ioc';
import HasRedisClient from './redis-store';

export default class RateLimiter extends HasRedisClient {
  readonly rateLimiters;

  constructor({ rateLimiterConfig, logger }: Pick<IoC, 'rateLimiterConfig' | 'logger'>) {
    const { redis, ...rest } = rateLimiterConfig;
    super({ config: redis, logger: logger.child({ service: 'RateLimiter' }) });

    this.rateLimiters = rest;
  }

  createMiddleware(type: keyof typeof this.rateLimiters, options: Partial<Options>) {
    return rateLimit({
      windowMs: this.rateLimiters[type].window,
      max: this.rateLimiters[type].max,
      standardHeaders: true,
      legacyHeaders: false,

      ...options,

      store: new RedisStore({
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => this.redis.call(...args),
        prefix: this.config.keyPrefix,
      }),
    });
  }
}
