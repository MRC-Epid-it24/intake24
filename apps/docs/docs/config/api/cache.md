# Cache

Path: `src/config/cache.ts`

[Redis](https://redis.io) is used as session driver.

Redis is also used for other parts of system (queue, session), they have separate connection settings, so they can be configured independently if needed.

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

### Prefix
Prefix string which is pre-pended to each key to identify cache data.

* object-path: `redis.keyPrefix`
* dotenv var: `CACHE_REDIS_PREFIX`
* type: `string`
* default: `'it24:cache:'`
