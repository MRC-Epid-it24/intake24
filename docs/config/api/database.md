# Database

Path: `packages/db/src/config.ts`

Connection info is defined per-environment and per-database.

System consists of two databases:

- `Foods` - food-related information, mostly static content
- `System` - users / surveys related information, system configuration etc

Environments:

- `development` - local development environment
- `test` - local tests and CI environment
- `production` - production environment

## Host

- object-path: `[environment][database].host`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_HOST` and `DB_DEV_SYSTEM_HOST`
  - `test`: `DB_TEST_FOODS_HOST` and `DB_TEST_SYSTEM_HOST`
  - `production`: `DB_FOODS_HOST` and `DB_SYSTEM_HOST`
- type: `string`
- default: `'localhost'`

## Port

- object-path: `[environment][database].port`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_PORT` and `DB_DEV_SYSTEM_PORT`
  - `test`: `DB_TEST_FOODS_PORT` and `DB_TEST_SYSTEM_PORT`
  - `production`: `DB_FOODS_PORT` and `DB_SYSTEM_PORT`
- type: `number`
- default: `5432`

## Database

- object-path: `[environment][database].database`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_DATABASE` and `DB_DEV_SYSTEM_DATABASE`
  - `test`: `DB_TEST_FOODS_DATABASE` and `DB_TEST_SYSTEM_DATABASE`
  - `production`: `DB_FOODS_DATABASE` and `DB_SYSTEM_DATABASE`
- type: `string`
- default: `'intake24_foods'` and `'intake24_system'`

## Username

- object-path: `[environment][database].username`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_USERNAME` and `DB_DEV_SYSTEM_USERNAME`
  - `test`: `DB_TEST_FOODS_USERNAME` and `DB_TEST_SYSTEM_USERNAME`
  - `production`: `DB_FOODS_USERNAME` and `DB_SYSTEM_USERNAME`
- type: `string`
- default: `'intake24'`

## Password

- object-path: `[environment][database].password`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_PASSWORD` and `DB_DEV_SYSTEM_PASSWORD`
  - `test`: `DB_TEST_FOODS_PASSWORD` and `DB_TEST_SYSTEM_PASSWORD`
  - `production`: `DB_FOODS_PASSWORD` and `DB_SYSTEM_PASSWORD`
- type: `string`
- default: `''`

## Dialect

- object-path: `[environment][database].dialect`
- dotenv vars:
  - `development`: `DB_DEV_FOODS_DRIVER` and `DB_DEV_SYSTEM_DRIVER`
  - `test`: `DB_TEST_FOODS_DRIVER` and `DB_TEST_SYSTEM_DRIVER`
  - `production`: `DB_FOODS_DRIVER` and `DB_SYSTEM_DRIVER`
- type: `'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'`
- default: `'postgres'`
