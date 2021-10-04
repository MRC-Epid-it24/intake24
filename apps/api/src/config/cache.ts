import { RedisOptions } from 'ioredis';

export type CacheConfig = {
  redis: RedisOptions;
  prefix: string;
};

const cacheConfig: CacheConfig = {
  redis: {
    host: process.env.CACHE_REDIS_HOST || 'localhost',
    port: parseInt(process.env.CACHE_REDIS_PORT || '6379', 10),
  },
  prefix: process.env.CACHE_PREFIX || 'cache:it24',
};

export default cacheConfig;
