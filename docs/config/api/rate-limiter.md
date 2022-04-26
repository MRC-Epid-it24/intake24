# Rate limiter

Path: `apps/api/src/config/rate-limiter.ts`

[Redis](https://redis.io) is used as rate-limiter store driver.

Redis is also used for other parts of system (cache, queue, session), they have separate connection settings, so they can be configured independently if needed.

:::tip Rate limiter time window definition
Time window to track the requests is defined as `ms-formatted` string, see [ms](https://github.com/vercel/ms) for more information.
:::

## Redis instance

### Host

- object-path: `redis.host`
- dotenv var: `RATE_LIMITER_REDIS_HOST`
- type: `string`
- default: `'localhost'`

### Port

- object-path: `redis.port`
- dotenv var: `RATE_LIMITER_REDIS_PORT`
- type: `number`
- default: `6379`

### Prefix

Prefix string which is pre-pended to each key to identify cache data.

- object-path: `redis.keyPrefix`
- dotenv var: `RATE_LIMITER_REDIS_PREFIX`
- type: `string`
- default: `'it24:rate-limiter:'`

## Login

Rate limit settings for `/api/auth/login | /api/auth/login/alias | /api/auth/login/token` routes.

### Window

Time window to track the requests.

- object-path: `login.window`
- dotenv var: `RATE_LIMITER_LOGIN_WINDOW`
- type: `string`
- default: `'15m'`

### Max

Maximum number of requests that can be made within the specified time window.

- object-path: `login.max`
- dotenv var: `RATE_LIMITER_LOGIN_MAX`
- type: `number`
- default: `5`

## Password

Rate limit settings for `/api/password` routes.

### Window

Time window to track the requests.

- object-path: `password.window`
- dotenv var: `RATE_LIMITER_PASSWORD_WINDOW`
- type: `string`
- default: `'5m'`

### Max

Maximum number of requests that can be made within the specified time window.

- object-path: `password.max`
- dotenv var: `RATE_LIMITER_PASSWORD_MAX`
- type: `number`
- default: `1`

## Generate user

Rate limit settings for `/api/surveys/:surveyId/generate-user` routes.

### Window

Time window to track the requests.

- object-path: `generateUser.window`
- dotenv var: `RATE_LIMITER_GEN_USER_WINDOW`
- type: `string`
- default: `'5m'`

### Max

Maximum number of requests that can be made within the specified time window.

- object-path: `generateUser.max`
- dotenv var: `RATE_LIMITER_GEN_USER_MAX`
- type: `number`
- default: `1`

## PDF outputs

Rate limit settings for `/api/user/feedback` - `download` and `email` routes.

### Window

Time window to track the requests.

- object-path: `feedback.window`
- dotenv var: `RATE_LIMITER_FEEDBACK_WINDOW`
- type: `string`
- default: `'1m'`

### Max

Maximum number of requests that can be made within the specified time window.

- object-path: `feedback.max`
- dotenv var: `RATE_LIMITER_FEEDBACK_MAX`
- type: `number`
- default: `1`
