import type { RedisOptions } from 'ioredis';

export type CacheConfig = {
  redis: RedisOptions;
  ttl: string;
};

const cacheConfig: CacheConfig = {
  redis: {
    host: process.env.CACHE_REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.CACHE_REDIS_PORT || '6379', 10),
    keyPrefix: process.env.CACHE_REDIS_PREFIX || 'it24:cache:',
  },
  ttl: process.env.CACHE_TTL || '7d',
};

export default cacheConfig;
