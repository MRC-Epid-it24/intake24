# API Server

Configuration is structured to following sections:

* [Application](#application)
* [Access Control List (ACL)](#access-control-list-acl)
* [Database](#database)
* [Filesystem](#filesystem)
* [Mail](#mail)
* [Security](#security)

## Application

Path: `src/config/app.ts`

### Node environment

Node environment to start the application in.

* object-path: `env`
* dotenv var: `NODE_ENV`
* type: `'development' | 'test' | 'production'`
* default: `'development'`

### Name

Application name.

* object-path: `env`
* dotenv var: `APP_NAME`
* type: `string`
* default: `'Intake24'`

### Host

Internal hostname application listens on.

* object-path: `host`
* dotenv var: `APP_HOST`
* type: `string`
* default: `'localhost'`

### Port

Internal port application listens on.

* object-path: `port`
* dotenv var: `APP_PORT`
* type: `number`
* default: `3100`

### Sites URLs

List of sites URLs. These can either be relative or absolute URLs.

* absolute URL -> site is hosted on different domain
* relative URL -> site is hosted on same domain. URL gets registered as route.

#### Admin URL

URL of admin site.

* object-path: `url.admin`
* dotenv var: `APP_URL_ADMIN`
* type: `string`
* default: `'/admin'`

#### Documentation URL

URL of documentation site.

* object-path: `url.docs`
* dotenv var: `APP_URL_DOCS`
* type: `string`
* default: `'/docs'`

#### Survey URL

URL of survey site.

* object-path: `url.survey`
* dotenv var: `APP_URL_SURVEY`
* type: `string`
* default: `'/survey'`

## Access control list (ACL)

Access control list (`ACL`) implementation is based on three models:

* `user`
* `role`
* `permission`

Relations between the models are defined as follows:

* `many-to-many` between `user` and `role`
* `many-to-many` between `user` and `permission`
* `many-to-many` between `role` and `permission`

This allows to grant permissions to users in two ways:

* directly associate `permission` with `user`
* associate `permission` with `user` through `role` (acting as grouping record for a set of permissions)

Path: `src/config/acl.ts`

### Roles

List of special-purpose roles.

* object-path: `roles`

#### Superuser

Any newly created permission will be associated with this role.

* object-path: `roles.superuser`
* type: `string`
* default: `'superuser'`

### Permissions

List of special-purpose permissions.

* object-path: `permissions`

#### Global support

Name of the permission, which defines top-level system support.

* object-path: `permissions.globalsupport`
* type: `string`
* default: `'globalsupport'`

#### Survey admin

Name of the permission, which allows to work with any `survey` record.

* object-path: `permissions.surveyadmin`
* type: `string`
* default: `'surveyadmin'`

#### Foods admin

Name of the permission, which allows to work with any `food` record.

* object-path: `permissions.foodsadmin`
* type: `string`
* default: `'foodsadmin'`

## Database

System consists of two databases:

* Foods - stores food-related information, mostly static content
* System - stores users/surveys related information, system configuration etc

Connection info is defined per-environment (`development`, `test`, `production`) and per-database (`foods` and `system`).

Path: `src/config/database.ts`

### Host

* object-path: `[environment][database].host`
* dotenv var: `DB_FOODS_HOST` and `DB_SYSTEM_HOST`
* type: `string`
* default: `'localhost'`

### Port

* object-path: `[environment][database].port`
* dotenv var: `DB_FOODS_PORT` and `DB_SYSTEM_PORT`
* type: `number`
* default: `5432`

### Database

* object-path: `[environment][database].database`
* dotenv var: `DB_FOODS_DATABASE` and `DB_SYSTEM_DATABASE`
* type: `string`
* default: `'intake24_foods'` and `'intake24_system'`

### Username

* object-path: `[environment][database].username`
* dotenv var: `DB_FOODS_USERNAME` and `DB_SYSTEM_USERNAME`
* type: `string`
* default: `'intake24'`

### Password

* object-path: `[environment][database].password`
* dotenv var: `DB_FOODS_PASSWORD` and `DB_SYSTEM_PASSWORD`
* type: `string`
* default: `''`

### Dialect

* object-path: `[environment][database].dialect`
* dotenv var: `DB_FOODS_DRIVER` and `DB_SYSTEM_DRIVER`
* type: `'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'`
* default: `'postgres'`

## Filesystem

Path: `src/config/filesystem.ts`

### Logs dir

Logs directory where all application logs are stored.

* object-path: `local.logs`
* dotenv var: `FS_LOGS`
* type: `string`
* default: `'storage/logs'`

### Public dir

Public directory for serving static files.

* object-path: `local.public`
* dotenv var: `FS_PUBLIC`
* type: `string`
* default: `'public'`

## Mail

Mail implementation supports following transports:

* `SMTP` - SMTP protocol
* `Log` - logs messages to `stdout` (for debugging purposes)

Implementation is using [nodemailer](https://nodemailer.com).

Path: `src/config/mail.ts`

### Mailer

Selected mailer transport

* object-path: `mailer`
* dotenv var: `MAIL_MAILER`
* type: `'smtp' | 'log'`
* default: `'log'`

### SMTP transport

#### Host

* object-path: `mailers.smtp.host`
* dotenv var: `MAIL_HOST`
* type: `string`
* default: `'localhost'`

#### Port

* object-path: `mailers.smtp.port`
* dotenv var: `MAIL_PORT`
* type: `number`
* default: `25`

#### Secure

* object-path: `mailers.smtp.secure`
* dotenv var: `MAIL_SECURE`
* type: `boolean`
* default: `false`

#### ignoreTLS

* object-path: `mailers.smtp.ignoreTLS`
* dotenv var: `MAIL_IGNORE_TLS`
* type: `boolean`
* default: `false`

#### Authentication

* object-path: `mailers.smtp.auth.username`
* dotenv var: `MAIL_USERNAME`
* type: `string | null`
* default: `null`

* object-path: `mailers.smtp.auth.pass`
* dotenv var: `MAIL_PASSWORD`
* type: `string | null`
* default: `null`

### From

* object-path: `from`

#### Address

* object-path: `from.address`
* dotenv var: `MAIL_FROM_ADDRESS`
* type: `string`
* default: `'example@domain.com'`

#### Name

* object-path: `from.name`
* dotenv var: `MAIL_FROM_NAME`
* type: `string`
* default: `'Intake24'`

## Security

Path: `src/config/security.ts`

### Cross-origin resource sharing (CORS)

#### CORS Origin

Single origin or list of origins to allow cross-origin resource sharing. Define these, when SPA applications (`admin` and `survey` sites) are deployed to different domain than `API Server`

* object-path: `cors.origin`
* dotenv var: `CORS_ORIGIN` (for list of origins, use `comma-delimited` string)
* type: `string | string[] | boolean`
* default: `false`

### JSON web tokens

JSON web tokens (`JWT`) settings

#### Issuer

Issuer for signing JWT tokens

* object-path: `jwt.issuer`
* type: `string`
* default: `'intake24'`

#### Access token secret

Secret to sign JWT access token

* object-path: `jwt.access.secret`
* dotenv var: `JWT_ACCESS_SECRET`
* type: `string`

#### Access token lifetime

Lifetime of JWT access token. Define as ms-formatted string, see [ms](https://github.com/vercel/ms) for more information.

* object-path: `jwt.access.lifetime`
* dotenv var: `JWT_ACCESS_LIFETIME`
* type: `string`
* default: `'15m'`

#### Refresh token secret

Secret to sign JWT refresh token

* object-path: `jwt.refresh.secret`
* dotenv var: `JWT_REFRESH_SECRET`
* type: `string`

#### Refresh token lifetime

Lifetime of JWT refresh token. Define as ms-formatted string, see [ms](https://github.com/vercel/ms) for more information.

* object-path: `jwt.refresh.lifetime`
* dotenv var: `JWT_REFRESH_LIFETIME`
* type: `string`
* default: `'1d'`

### JWT Refresh token cookie

Refresh token is stored in `http-only` cookie in client's browser. There are several properties to configure refresh token cookie.

#### Cookie name

* object-path: `jwt.cookie.name`
* type: `string`
* default: `it24_refresh_token`

#### Cookie maxAge

* object-path: `jwt.cookie.name`
* default: `jwt.refresh.lifetime` value
* type: `string`

#### Cookie httpOnly

* object-path: `jwt.cookie.httpOnly`
* type: `boolean`
* default: `true`

#### Cookie path

* object-path: `jwt.cookie.path`
* dotenv var: `JWT_COOKIE_PATH`
* type: `string`
* default: `'/api/refresh'`

#### Cookie sameSite

* object-path: `jwt.cookie.sameSite`
* dotenv var: `JWT_COOKIE_SAMESITE`
* type: `boolean | 'lax' | 'strict' | 'none'`
* default: `'lax'`

#### Cookie secure

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

For more information, check out [duo's documentation for WebSDK](https://duo.com/docs/duoweb)

#### Integration key

* object-path: `mfa.providers.duo.ikey`
* dotenv var: `DUO_IKEY`
* type: `string`
* default: `''`

#### Secret key

* object-path: `mfa.providers.duo.skey`
* dotenv var: `DUO_SKEY`
* type: `string`
* default: `''`

#### Application secret key

* object-path: `mfa.providers.duo.akey`
* dotenv var: `DUO_AKEY`
* type: `string`
* default: `''`

#### Host

API hostname (e.g. api-a1b2c3d4e5.duosecurity.com)

* object-path: `mfa.providers.duo.host`
* dotenv var: `DUO_HOST`
* type: `string`
* default: `''`

## Google reCAPTCHA

Password recovery can be protected by [Google reCAPTCHA](https://developers.google.com/recaptcha/intro). V2 is currently supported.

### Enabled

Determines whether the reCAPTCHA is enabled or not.

* object-path: `recaptcha.enabled`
* dotenv var: `RECAPTCHA_ENABLED`
* type: `boolean`
* default: `false`

### Secret key

* object-path: `recaptcha.secret`
* dotenv var: `RECAPTCHA_SECRET`
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
