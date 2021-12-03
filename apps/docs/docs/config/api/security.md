# Security

Path: `src/config/security.ts`

## Cross-origin resource sharing (CORS)

### CORS Origin

Single origin or list of origins to allow cross-origin resource sharing. Define these, when SPA applications (`Admin client` and `Survey client`) are deployed to different domain than `API server`.

* object-path: `cors.origin`
* dotenv var: `CORS_ORIGIN` (for list of origins, use `comma-delimited` string)
* type: `string | string[] | boolean`
* default: `false`

## Proxy

List of trusted proxies. It allows to define list proxies if application is behind multiple reverse proxies / load balancers.

Since application is usually at least behind local reverse proxy, set as `loopback` (which translates to `127.0.0.1 / ::1`).

* object-path: `proxy`
* dotenv var: `PROXY` (`comma-delimited` string list)
* type: `string[] | boolean`
* default: `false`

## JSON web tokens

JSON web tokens (`JWT`) settings

### Issuer

Issuer for signing JWT tokens

* object-path: `jwt.issuer`
* type: `string`
* default: `'intake24'`

### Access token secret

Secret to sign JWT access token

* object-path: `jwt.access.secret`
* dotenv var: `JWT_ACCESS_SECRET`
* type: `string`

### Access token lifetime

Lifetime of JWT access token. Defined as `ms-formatted` string, see [ms](https://github.com/vercel/ms) for more information.

* object-path: `jwt.access.lifetime`
* dotenv var: `JWT_ACCESS_LIFETIME`
* type: `string`
* default: `'15m'`

### Refresh token secret

Secret to sign JWT refresh token

* object-path: `jwt.refresh.secret`
* dotenv var: `JWT_REFRESH_SECRET`
* type: `string`

### Refresh token lifetime

Lifetime of JWT refresh token. Defined as `ms-formatted` string, see [ms](https://github.com/vercel/ms) for more information.

* object-path: `jwt.refresh.lifetime`
* dotenv var: `JWT_REFRESH_LIFETIME`
* type: `string`
* default: `'1d'`

## JWT Refresh token cookie

Refresh token is stored in `http-only` cookie in client's browser. There are several properties to configure refresh token cookie.

### Cookie name

* object-path: `jwt.cookie.name`
* type: `string`
* default: `it24_refresh_token`

### Cookie maxAge

Lifetime of cookie. Defined as `ms-formatted` string, see [ms](https://github.com/vercel/ms) for more information.

* object-path: `jwt.cookie.maxAge`
* default: `jwt.refresh.lifetime` value
* type: `string`

### Cookie httpOnly

* object-path: `jwt.cookie.httpOnly`
* type: `boolean`
* default: `true`

### Cookie path

* object-path: `jwt.cookie.path`
* dotenv var: `JWT_COOKIE_PATH`
* type: `string`
* default: `'/api/auth'`

### Cookie sameSite

* object-path: `jwt.cookie.sameSite`
* dotenv var: `JWT_COOKIE_SAMESITE`
* type: `boolean | 'lax' | 'strict' | 'none'`
* default: `'lax'`

### Cookie secure

* object-path: `jwt.cookie.httpOnly`
* dotenv var: `JWT_COOKIE_SECURE`
* type: `boolean`
* default: `false`

## Multi-factor authentication (MFA)

System supports multi-factor authentication (`MFA`) for admin login.

Supported providers:

* [Duo Security](https://duo.com)

MFA has to be enabled on system-level (configuration) and user-level (database user record).

### Enabled

Determines whether the MFA is system-enabled or not

* object-path: `mfa.enabled`
* dotenv var: `MFA_ENABLED`
* type: `boolean`
* default: `false`

### Provider

Selected provider for MFA

* object-path: `mfa.provider`
* dotenv var: `MFA_PROVIDER`
* type: `'duo'`
* default: `'duo'`

### Duo provider settings

For more information, check out [duo's documentation for WebSDK](https://duo.com/docs/duoweb). Intake24 implements Universal Prompt flow.

#### Duo client ID

Duo client ID - can be found in Duo administration

* object-path: `mfa.providers.duo.clientId`
* dotenv var: `DUO_CLIENT_ID`
* type: `string`
* default: `''`

#### Duo client secret

Duo client secret - can be found in Duo administration

* object-path: `mfa.providers.duo.clientSecret`
* dotenv var: `DUO_CLIENT_SECRET`
* type: `string`
* default: `''`

#### Duo API host

Duo API hostname (e.g. api-a1b2c3d4e5.duosecurity.com) - can be found in Duo administration

* object-path: `mfa.providers.duo.apiHost`
* dotenv var: `DUO_API_HOST`
* type: `string`
* default: `''`

#### Duo redirect URL

URL where to redirect from MFA verification step. This should be admin tool login page.

* object-path: `mfa.providers.duo.redirectUrl`
* dotenv var: `DUO_REDIRECT_URL`
* type: `string`
* default: `''`

## Passwords

Settings for password restore functionality.

### Expire

Password reset link expiration in **minutes**.

* object-path: `passwords.expire`
* type: `number`
* default: `60`

### Throttle

Rate limit setting for password request. It allows 1 request per `throttle` value. Value is set in **seconds**.

* object-path: `passwords.throttle`
* type: `number`
* default: `60`

## Authentication tokens

Settings for generation of random authentication tokens.

### Size

Size of the tokens - string's length.

* object-path: `authTokens.size`
* type: `number`
* default: `21`

### Alphabet

String of custom alphabet - character set to be used for token generation.

* object-path: `authTokens.alphabet`
* type: `string | null`
* default: `null`

## Sign-in logging

Settings for sign-in logging.

### Enabled

Enable/disable database logging of sign-in attempts.

* object-path: `signInLog.enabled`
* type: `boolean`
* default: `true`
