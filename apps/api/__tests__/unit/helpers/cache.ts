import '../../bootstrap';

import { default as cacheConfig } from '@intake24/api/config/cache';
import { Cache } from '@intake24/api/services';
import { logger } from '@intake24/services';

export async function initCache(): Promise<Cache> {
  console.info(`Using Redis instance on ${cacheConfig.redis.host}:${cacheConfig.redis.port}`);

  const cache = new Cache({ cacheConfig, logger });

  await cache.init();

  return cache;
}

export async function releaseCache(cache: Cache): Promise<void> {
  await cache.close();
}
