import type { RedisOptions as BaseRedisOptions } from 'ioredis';

export type RedisOptions = BaseRedisOptions & {
  url?: string;
};
