# Session

Path: `apps/api/src/config/session.ts`

[Redis](https://redis.io) is used as session store driver.

Redis is also used for other parts of system (cache, queue, rate limiter), they have separate connection settings, so they can be configured independently if needed.

## Redis instance

### Host

- object-path: `redis.host`
- dotenv var: `SESSION_REDIS_HOST`
- type: `string`
- default: `'localhost'`

### Port

- object-path: `redis.port`
- dotenv var: `SESSION_REDIS_PORT`
- type: `number`
- default: `6379`

### Prefix

Prefix string which is pre-pended to each key to identify cache data.

- object-path: `redis.keyPrefix`
- dotenv var: `SESSION_REDIS_PREFIX`
- type: `string`
- default: `'it24:session:'`

## Cookie

### Cookie name

- object-path: `cookie.name`
- dotenv var: `SESSION_COOKIE_NAME`
- type: `string`
- default: `it24_session`

### Cookie maxAge

Lifetime of cookie. Defined as `ms-formatted` string, see [ms](https://github.com/vercel/ms) for more information.

- object-path: `cookie.maxAge`
- dotenv var: `SESSION_COOKIE_LIFETIME`
- default: `'15m'`
- type: `string`

### Cookie httpOnly

- object-path: `cookie.httpOnly`
- type: `boolean`
- default: `true`

### Cookie path

- object-path: `cookie.path`
- dotenv var: `SESSION_COOKIE_PATH`
- type: `string`
- default: `'/api/admin/auth'`

### Cookie sameSite

- object-path: `cookie.sameSite`
- dotenv var: `SESSION_COOKIE_SAME_SITE`
- type: `boolean | 'lax' | 'strict' | 'none'`
- default: `'lax'`

### Cookie secure

- object-path: `cookie.httpOnly`
- dotenv var: `SESSION_COOKIE_SECURE`
- type: `boolean`
- default: `false`
