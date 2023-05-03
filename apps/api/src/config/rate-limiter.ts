import type { Options } from 'express-rate-limit';
import type { RedisOptions } from 'ioredis';
import ms from 'ms';

export type RateLimit = {
  windowMs: number;
  max: number;
};

export type RateLimits = Record<
  'generic' | 'login' | 'password' | 'generateUser' | 'feedback',
  Partial<Options>
>;

export interface RateLimiterConfig extends RateLimits {
  redis: RedisOptions;
}

const rateLimiterConfig: RateLimiterConfig = {
  redis: {
    host: process.env.RATE_LIMITER_REDIS_HOST || 'localhost',
    port: parseInt(process.env.RATE_LIMITER_REDIS_PORT || '6379', 10),
    keyPrefix: process.env.RATE_LIMITER_REDIS_PREFIX || 'it24:rate-limiter:',
  },
  generic: {
    windowMs: ms(process.env.RATE_LIMITER_GENERIC_WINDOW || '5m'),
    max: parseInt(process.env.RATE_LIMITER_GENERIC_MAX || '300', 10),
  },
  login: {
    windowMs: ms(process.env.RATE_LIMITER_LOGIN_WINDOW || '15m'),
    max: parseInt(process.env.RATE_LIMITER_LOGIN_MAX || '5', 10),
  },
  password: {
    windowMs: ms(process.env.RATE_LIMITER_PASSWORD_WINDOW || '5m'),
    max: parseInt(process.env.RATE_LIMITER_PASSWORD_MAX || '1', 10),
  },
  generateUser: {
    windowMs: ms(process.env.RATE_LIMITER_GEN_USER_WINDOW || '5m'),
    max: parseInt(process.env.RATE_LIMITER_GEN_USER_MAX || '1', 10),
  },
  feedback: {
    windowMs: ms(process.env.RATE_LIMITER_FEEDBACK_WINDOW || '1m'),
    max: parseInt(process.env.RATE_LIMITER_FEEDBACK_MAX || '1', 10),
  },
};

export default rateLimiterConfig;
