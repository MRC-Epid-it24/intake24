import { mapValues } from 'lodash';
import ms from 'ms';
import stringify from 'safe-stable-stringify';

import type { IoC } from '@intake24/api/ioc';
import { mapKeys } from '@intake24/common/util';

import HasRedisClient from './redis-store';

export type CacheValue = string | number | unknown[] | null | boolean | object;

export default class Cache extends HasRedisClient {
  constructor({ cacheConfig, logger }: Pick<IoC, 'cacheConfig' | 'logger'>) {
    super({ config: cacheConfig.redis, logger: logger.child({ service: 'Cache' }) });
  }

  /**
   * Retrieve item from cache by given key
   *
   * @template T
   * @param {string} key
   * @returns {(Promise<T | null>)}
   * @memberof Cache
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);

    return data ? (JSON.parse(data) as T) : null;
  }

  /**
   * Retrieve multiple items.
   *
   * @template T
   * @param {string[]} keys to retrieve
   * @returns {(Promise<Record<string, T | null>>)} map of keys to cached values or
   * null if key is not set
   * @memberof Cache
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!keys.length) return [];

    const cached = await this.redis.mget(keys);
    return cached.map((item) => (item ? (JSON.parse(item) as T) : null));
  }

  /**
   * Check if item exists in cache
   *
   * @param {string} key
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async has(key: string): Promise<boolean> {
    return !!(await this.redis.exists(key));
  }

  /**
   * Store item in cache, for given time optionally
   *
   * @param {string} key
   * @param {CacheValue} value
   * @param {(number | string)} [ttl] expiration time in seconds or 'ms' string format
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async set(key: string, value: CacheValue, ttl?: number | string): Promise<boolean> {
    if (!ttl) {
      const result = await this.redis.set(key, stringify(value));
      return !!result;
    }

    const result = await this.redis.set(
      key,
      stringify(value),
      'PX',
      typeof ttl === 'string' ? ms(ttl) : ttl * 1000
    );

    return !!result;
  }

  /**
   * Store multiple items atomically.
   *
   * Uses Redis' mset feature unless an expiration time is provided, in which case
   * sets every item individually in a transaction (MULTI).
   *
   * @param {Record<string, CacheValue>} keyValues a record/object with key/value pairs
   * @param {(number | string)} [ttl] expiration time in seconds or 'ms' string format
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async mset(keyValues: Record<string, CacheValue>, ttl?: number | string): Promise<boolean> {
    const serialised = mapValues(keyValues, (v) => stringify(v));

    if (!ttl) {
      const result = await this.redis.mset(keyValues);
      return !!result;
    }

    const tx = this.redis.multi();

    for (const kv of Object.entries(serialised)) {
      tx.set(kv[0], kv[1], 'PX', typeof ttl === 'string' ? ms(ttl) : ttl * 1000);
    }

    const result = await tx.exec();

    return !!result;
  }

  /**
   * Remove item from cache
   *
   * @returns {Promise<boolean>}
   * @memberof Cache
   */
  async forget(key: string | string[]): Promise<boolean> {
    const keysToDelete = Array.isArray(key) ? key : [key];
    const result = await this.redis.del(keysToDelete);

    return !!result;
  }

  /**
   * Get data from cache if available
   * If not in cache, fresh data are fetched by provided callback stored in cache
   *
   *
   * @template T
   * @param {string} key
   * @param {(number | string)} ttl expiration time in seconds or 'ms' string format
   * @param {() => Promise<T>} getData
   * @returns {Promise<T>}
   * @memberof Cache
   */
  async remember<T extends {}>(
    key: string,
    ttl: number | string,
    getData: () => Promise<T>
  ): Promise<T> {
    const cachedData = await this.get<T>(key);
    if (cachedData !== null) return cachedData;

    const freshData = await getData();
    await this.set(key, freshData, ttl);

    return freshData;
  }

  /**
   * Get multiple items from cache if available.
   * If not in cache, getData callback is called for missing keys and the result it cached.
   *
   * @template T
   * @param {string[]} keys
   * @param {string} cacheKeyPrefix
   * @param {(number | string)} ttl expiration time in seconds or 'ms' string format
   * @param {((keys: string[]) => Promise<Record<string, T | null>>)} getData
   * @returns {(Promise<Record<string, T | null>>)}
   * @memberof Cache
   */
  async rememberMany<T extends {}>(
    keys: string[],
    cacheKeyPrefix: string,
    ttl: number | string,
    getData: (keys: string[]) => Promise<Record<string, T | null>>
  ): Promise<Record<string, T | null>> {
    if (!keys.length) return {};

    const cacheKeys = keys.map((k) => `${cacheKeyPrefix}:${k}`);

    const cached = await this.mget<T>(cacheKeys);

    const keysToFetch = keys.filter((_, i) => cached[i] === null);

    const data = await getData(keysToFetch);

    await this.mset(
      mapKeys(data, (k) => `${cacheKeyPrefix}:${k}`),
      ttl
    );

    return Object.fromEntries(keys.map((k, i) => [k, cached[i] ?? data[k]]));
  }

  /**
   * Get data from cache if available
   * If not in cache, fresh data are fetched by provided callback stored in cache
   *
   * @template T
   * @param {string} key
   * @param {() => Promise<T>} getData
   * @returns {Promise<T>}
   * @memberof Cache
   */
  async rememberForever<T extends {}>(key: string, getData: () => Promise<T>): Promise<T> {
    const cachedData = await this.get<T>(key);
    if (cachedData !== null) return cachedData;

    const freshData = await getData();
    await this.set(key, freshData);

    return freshData;
  }
}
