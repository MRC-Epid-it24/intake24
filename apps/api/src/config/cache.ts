import { RedisOptions } from 'ioredis';

export type CacheConfig = {
  redis: RedisOptions;
};

const cacheConfig: CacheConfig = {
  redis: {
    host: process.env.CACHE_REDIS_HOST || 'localhost',
    port: parseInt(process.env.CACHE_REDIS_PORT || '6379', 10),
    keyPrefix: process.env.CACHE_REDIS_PREFIX || 'it24:cache:',
  },
};

export default cacheConfig;
