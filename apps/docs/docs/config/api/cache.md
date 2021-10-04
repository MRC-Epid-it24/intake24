# Cache

Path: `src/config/cache.ts`

[Redis](https://redis.io) is used as caching driver. Redis is also used for queues, they have separate connection settings, so they can be configured independently if needed.

## Prefix
Prefix string which is prepended to each key to identify cache data.

* object-path: `prefix`
* dotenv var: `CACHE_PREFIX`
* type: `string`
* default: `'cache:it24'`

## Redis instance

### Host

* object-path: `redis.host`
* dotenv var: `CACHE_REDIS_HOST`
* type: `string`
* default: `'localhost'`

### Port

* object-path: `redis.port`
* dotenv var: `CACHE_REDIS_PORT`
* type: `number`
* default: `6379`
