import type { RedisOptions } from './redis';

export type CacheConfig = {
  redis: RedisOptions;
  ttl: string;
  surveySettingsTTL: string;
};

const cacheConfig: CacheConfig = {
  redis: {
    url: process.env.CACHE_REDIS_URL || process.env.REDIS_URL || undefined,
    host: process.env.CACHE_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.CACHE_REDIS_PORT || process.env.REDIS_PORT || '6379', 10),
    db: Number.parseInt(process.env.CACHE_REDIS_DATABASE || process.env.REDIS_DATABASE || '0', 10),
    keyPrefix: process.env.CACHE_REDIS_PREFIX || 'it24:cache:',
  },
  ttl: process.env.CACHE_TTL || '7d',
  surveySettingsTTL: process.env.CACHE_SURVEY_SETTINGS_TTL || '120s',
};

export default cacheConfig;
