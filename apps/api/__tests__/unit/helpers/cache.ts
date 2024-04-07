import '@intake24/api/bootstrap';

import cacheConfig from '@intake24/api/config/cache';
import { Cache } from '@intake24/api/services';
import { logger } from '@intake24/common-backend';

export function initCache(): Cache {
  console.info(`Using Redis instance on ${cacheConfig.redis.host}:${cacheConfig.redis.port}`);

  const cache = new Cache({ cacheConfig, logger });

  cache.init();

  return cache;
}

export function releaseCache(cache: Cache) {
  cache.close();
}
